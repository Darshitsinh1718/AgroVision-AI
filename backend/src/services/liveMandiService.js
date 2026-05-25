import axios from 'axios'
import { fallbackMandiData, getNearestMarket } from '../utils/marketFallbackData.js'

const BASE_URL =
  'https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070'

const cache = new Map()
const CACHE_TTL_MS = 30 * 60 * 1000

function getApiKey() {
  return (process.env.DATA_GOV_API_KEY || '').replaceAll('"', '').trim()
}

function getCached(key) {
  const entry = cache.get(key)
  if (!entry) return null
  if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
    cache.delete(key)
    return null
  }
  return entry.data
}

function setCache(key, data) {
  cache.set(key, { data, timestamp: Date.now() })
}

function buildFilters({ state, district, market, commodity }) {
  const filters = {}
  if (state) filters['filters[State]'] = state
  if (district) filters['filters[District]'] = district
  if (market) filters['filters[Market]'] = market
  if (commodity) filters['filters[Commodity]'] = commodity
  return filters
}

function normalizeRecord(record) {
  return {
    state: record.state || record.State || '',
    district: record.district || record.District || '',
    market: record.market || record.Market || '',
    commodity: record.commodity || record.Commodity || '',
    variety: record.variety || record.Variety || '',
    grade: record.grade || record.Grade || '',
    arrival_date:
      record.arrival_date ||
      record.Arrival_Date ||
      record['Arrival_Date'] ||
      record['Arrival_x0020_Date'] ||
      '',
    min_price:
      record.min_price ||
      record.Min_Price ||
      record['Min_Price'] ||
      record['Min_x0020_Price'] ||
      '0',
    max_price:
      record.max_price ||
      record.Max_Price ||
      record['Max_Price'] ||
      record['Max_x0020_Price'] ||
      '0',
    modal_price:
      record.modal_price ||
      record.Modal_Price ||
      record['Modal_Price'] ||
      record['Modal_x0020_Price'] ||
      '0',
  }
}

async function fetchFromAPI(params) {
  const apiKey = getApiKey()

  if (!apiKey) {
    throw new Error('DATA_GOV_API_KEY missing in backend .env')
  }

  const queryParams = {
    'api-key': apiKey,
    format: 'json',
    limit: params.limit || 500,
    offset: params.offset || 0,
    ...buildFilters(params),
  }

  const response = await axios.get(BASE_URL, {
    params: queryParams,
    timeout: 15000,
    headers: { Accept: 'application/json' },
  })

  if (!response.data || !Array.isArray(response.data.records)) {
    throw new Error('Invalid data.gov.in response')
  }

  return response.data.records
}

function filterFallback({ state, district, market, commodity } = {}) {
  return fallbackMandiData.filter((r) => {
    if (state && r.state?.toLowerCase() !== state.toLowerCase()) return false
    if (district && r.district?.toLowerCase() !== district.toLowerCase()) return false
    if (market && r.market?.toLowerCase() !== market.toLowerCase()) return false
    if (commodity && !r.commodity?.toLowerCase().includes(commodity.toLowerCase())) return false
    return true
  })
}

export async function getMandiPrices(opts = {}) {
  const cacheKey = JSON.stringify(opts)
  const cached = getCached(cacheKey)

  if (cached) {
    return { ...cached, fromCache: true }
  }

  try {
    const rawRecords = await fetchFromAPI(opts)
    const records = rawRecords.map(normalizeRecord)

    const result = {
      records,
      isLive: true,
      source: 'live',
      fromCache: false,
    }

    setCache(cacheKey, result)
    return result
  } catch (err) {
    console.error('[MandiService] Live API failed:', err.message)

    const filtered = filterFallback(opts)

    return {
      records: filtered,
      isLive: false,
      source: 'fallback',
      fromCache: false,
      error: err.message,
    }
  }
}

export async function getNearestMarketPrices(userProfile = {}, commodity = null) {
  const { state = 'Gujarat', district, taluka } = userProfile

  const nearestMarket = getNearestMarket(state, district, taluka)

  const result = await getMandiPrices({
    state,
    district: district || undefined,
    market: nearestMarket || undefined,
    commodity: commodity || undefined,
    limit: 500,
  })

  return {
    ...result,
    nearestMarket: nearestMarket || district || state,
  }
}

export async function getAvailableMarkets(state = 'Gujarat', district = '') {
  const cacheKey = `markets:${state}:${district}`
  const cached = getCached(cacheKey)
  if (cached) return cached

  try {
    const rawRecords = await fetchFromAPI({
      state,
      district: district || undefined,
      limit: 1000,
    })

    const records = rawRecords.map(normalizeRecord)
    const markets = [...new Set(records.map((r) => r.market).filter(Boolean))].sort()

    setCache(cacheKey, markets)
    return markets
  } catch (err) {
    console.error('[MandiService] getAvailableMarkets failed:', err.message)

    const records = filterFallback({ state, district })
    return [...new Set(records.map((r) => r.market).filter(Boolean))].sort()
  }
}

export async function getAvailableCommodities(state = 'Gujarat', market = '') {
  const cacheKey = `commodities:${state}:${market}`
  const cached = getCached(cacheKey)
  if (cached) return cached

  try {
    const rawRecords = await fetchFromAPI({
      state,
      market: market || undefined,
      limit: 1000,
    })

    const records = rawRecords.map(normalizeRecord)
    const commodities = [...new Set(records.map((r) => r.commodity).filter(Boolean))].sort()

    setCache(cacheKey, commodities)
    return commodities
  } catch (err) {
    console.error('[MandiService] getAvailableCommodities failed:', err.message)

    const records = filterFallback({ state, market })
    return [...new Set(records.map((r) => r.commodity).filter(Boolean))].sort()
  }
}
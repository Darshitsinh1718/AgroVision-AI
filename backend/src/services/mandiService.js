// backend/src/services/mandiService.js
// ─────────────────────────────────────────────────────────
// Mandi price service.
//
// Primary:  data.gov.in Open Government Data API
//           Dataset: Current Daily Price of Various Commodities
//           API: https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070
//           Free, requires API key (sign up at data.gov.in)
//
// Fallback: Rich mock dataset (mandiMockData.js)
//           Covers 50+ mandis across 10 states.
//
// Also provides:
//   • Price trend simulation (7-day)
//   • MSP comparison
//   • Best market finder (highest price for a commodity)
//   • State/commodity filtering
// ─────────────────────────────────────────────────────────

import {
  MOCK_MANDI_PRICES,
  PRICE_HISTORY,
  MSP_PRICES,
  INDIAN_STATES,
  COMMODITIES,
} from '../utils/mandiMockData.js'

const DATA_GOV_API_KEY  = process.env.DATA_GOV_API_KEY || ''
const DATA_GOV_BASE     = 'https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070'
const CACHE_TTL_MS      = 30 * 60 * 1000  // 30 minutes

// ── In-memory cache ───────────────────────────────────────
const cache = new Map()
function getCached(key) {
  const e = cache.get(key)
  if (!e || Date.now() > e.exp) { cache.delete(key); return null }
  return e.data
}
function setCache(key, data) {
  cache.set(key, { data, exp: Date.now() + CACHE_TTL_MS })
}

// ── Call data.gov.in API ──────────────────────────────────
async function fetchFromDataGov({ state, commodity, limit = 50 }) {
  if (!DATA_GOV_API_KEY) throw new Error('No DATA_GOV_API_KEY')

  const params = new URLSearchParams({
    'api-key':  DATA_GOV_API_KEY,
    format:     'json',
    limit,
    offset:     0,
  })

  if (state && state !== 'All India')
    params.append('filters[state]', state)
  if (commodity && commodity !== 'All')
    params.append('filters[commodity]', commodity)

  const url = `${DATA_GOV_BASE}?${params}`
  const res  = await fetch(url, {
    signal: AbortSignal.timeout(10000),
    headers: { 'Accept': 'application/json' },
  })

  if (!res.ok) throw new Error(`data.gov.in API ${res.status}`)
  const data = await res.json()

  return (data.records || []).map(r => ({
    state:       r.state,
    district:    r.district,
    market:      r.market,
    commodity:   r.commodity,
    variety:     r.variety,
    grade:       r.grade,
    minPrice:    parseFloat(r.min_price),
    maxPrice:    parseFloat(r.max_price),
    modalPrice:  parseFloat(r.modal_price),
    date:        r.arrival_date,
    unit:        'Quintal',
  })).filter(r => !isNaN(r.modalPrice) && r.modalPrice > 0)
}

// ── Get from mock with filtering ──────────────────────────
function getFromMock({ state, commodity, search }) {
  let results = [...MOCK_MANDI_PRICES]

  if (state && state !== 'All India')
    results = results.filter(r => r.state === state)

  if (commodity && commodity !== 'All')
    results = results.filter(r =>
      r.commodity.toLowerCase().includes(commodity.toLowerCase())
    )

  if (search) {
    const q = search.toLowerCase()
    results = results.filter(r =>
      r.market.toLowerCase().includes(q) ||
      r.commodity.toLowerCase().includes(q) ||
      r.district.toLowerCase().includes(q) ||
      r.state.toLowerCase().includes(q)
    )
  }

  return results
}

// ── Compute previous day price (simulate) ─────────────────
function getPreviousPrice(record) {
  const history = PRICE_HISTORY[record.commodity]
  if (!history || history.length < 2) return record.modalPrice * 0.985
  return history[history.length - 2]
}

// ── Enrich records with computed fields ───────────────────
function enrich(records) {
  return records.map(r => {
    const prevPrice = getPreviousPrice(r)
    const change    = r.modalPrice - prevPrice
    const changePct = ((change / prevPrice) * 100)
    const msp       = MSP_PRICES[r.commodity] || null

    return {
      ...r,
      previousPrice:  Math.round(prevPrice),
      priceChange:    Math.round(change),
      priceChangePct: parseFloat(changePct.toFixed(2)),
      priceUp:        change >= 0,
      msp,
      aboveMSP:       msp ? r.modalPrice >= msp : null,
      mspDiff:        msp ? r.modalPrice - msp : null,
    }
  })
}

// ── MAIN: fetch mandi prices ──────────────────────────────
export async function fetchMandiPrices({ state, commodity, search, limit = 100 }) {
  const cacheKey = `mandi:${state}:${commodity}:${search}:${limit}`
  const hit = getCached(cacheKey)
  if (hit) return hit

  let records = []
  let source  = 'mock'

  // Try live API first
  try {
    records = await fetchFromDataGov({ state, commodity, limit })
    source  = 'data.gov.in'
  } catch (err) {
    // Fallback to mock
    records = getFromMock({ state, commodity, search })
    source  = 'mock'
  }

  // Filter by search if using API results
  if (source === 'data.gov.in' && search) {
    const q = search.toLowerCase()
    records = records.filter(r =>
      r.market.toLowerCase().includes(q) ||
      r.commodity.toLowerCase().includes(q) ||
      r.district.toLowerCase().includes(q)
    )
  }

  // Sort by modal price descending
  records.sort((a, b) => b.modalPrice - a.modalPrice)

  // Limit results
  records = records.slice(0, limit)

  const enriched = enrich(records)

  const result = {
    records:       enriched,
    total:         enriched.length,
    source,
    isMock:        source === 'mock',
    generatedAt:   new Date().toISOString(),
    date:          enriched[0]?.date || new Date().toISOString().split('T')[0],
    filters:       { state, commodity, search },
  }

  setCache(cacheKey, result)
  return result
}

// ── Get price history for a commodity ────────────────────
export function getCommodityHistory(commodity) {
  const history = PRICE_HISTORY[commodity]
  if (!history) return null

  const today    = new Date()
  const labels   = history.map((_, i) => {
    const d = new Date(today)
    d.setDate(d.getDate() - (history.length - 1 - i))
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
  })

  const current  = history[history.length - 1]
  const previous = history[history.length - 2]
  const change   = current - previous
  const msp      = MSP_PRICES[commodity] || null

  return {
    commodity,
    history,
    labels,
    current,
    previous,
    change,
    changePct: parseFloat(((change / previous) * 100).toFixed(2)),
    trend:     change > 0 ? 'up' : change < 0 ? 'down' : 'flat',
    min:       Math.min(...history),
    max:       Math.max(...history),
    msp,
    aboveMSP:  msp ? current >= msp : null,
  }
}

// ── Find best price for a commodity across states ─────────
export function getBestMarkets(commodity, topN = 5) {
  const records = MOCK_MANDI_PRICES.filter(r =>
    r.commodity.toLowerCase() === commodity.toLowerCase()
  ).sort((a, b) => b.modalPrice - a.modalPrice)

  return {
    commodity,
    highest: enrich(records.slice(0, topN)),
    lowest:  enrich([...records].reverse().slice(0, topN)),
    average: records.length > 0
      ? Math.round(records.reduce((s, r) => s + r.modalPrice, 0) / records.length)
      : 0,
    msp:     MSP_PRICES[commodity] || null,
  }
}

// ── Get market summary (for dashboard widgets) ────────────
export function getMarketSummary() {
  const today    = new Date().toISOString().split('T')[0]
  const enriched = enrich(MOCK_MANDI_PRICES)

  const topGainers = [...enriched]
    .sort((a, b) => b.priceChangePct - a.priceChangePct)
    .slice(0, 5)

  const topLosers = [...enriched]
    .sort((a, b) => a.priceChangePct - b.priceChangePct)
    .slice(0, 5)

  // Commodity-level averages
  const byComm = {}
  enriched.forEach(r => {
    if (!byComm[r.commodity]) byComm[r.commodity] = { prices: [], changes: [] }
    byComm[r.commodity].prices.push(r.modalPrice)
    byComm[r.commodity].changes.push(r.priceChangePct)
  })

  const commoditySummary = Object.entries(byComm).map(([comm, d]) => ({
    commodity:   comm,
    avgPrice:    Math.round(d.prices.reduce((s, p) => s + p, 0) / d.prices.length),
    avgChange:   parseFloat((d.changes.reduce((s, c) => s + c, 0) / d.changes.length).toFixed(2)),
    maxPrice:    Math.max(...d.prices),
    minPrice:    Math.min(...d.prices),
    msp:         MSP_PRICES[comm] || null,
  })).sort((a, b) => Math.abs(b.avgChange) - Math.abs(a.avgChange))

  return {
    date:             today,
    totalMandis:      [...new Set(enriched.map(r => r.market))].length,
    totalCommodities: [...new Set(enriched.map(r => r.commodity))].length,
    topGainers,
    topLosers,
    commoditySummary,
    msps:             MSP_PRICES,
  }
}

export { INDIAN_STATES, COMMODITIES, MSP_PRICES }
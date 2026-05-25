// backend/src/controllers/marketController.js
// ─────────────────────────────────────────────────────────
// UPDATED: Adds yard-based endpoints alongside existing ones.
// New endpoints:
//   GET  /api/v1/market/nearest    — nearest yards for a farmer location
//   GET  /api/v1/market/yards      — list yards by state/district/taluka
//   GET  /api/v1/market/yardprices — prices at a specific yard
//   GET  /api/v1/market/compare    — compare two yards for a crop
//
// Existing endpoints unchanged.
// ─────────────────────────────────────────────────────────

import {
  fetchMandiPrices,
  getCommodityHistory,
  getBestMarkets,
  getMarketSummary,
  INDIAN_STATES,
  COMMODITIES,
} from '../services/mandiService.js'

import {
  filterSchemes,
  getPersonalizedRecommendations,
  getSchemeById,
  getSchemeStats,
} from '../services/schemesService.js'

import {
  YARDS,
  YARD_PRICES,
  YARD_PRICE_HISTORY,
  getNearestYards,
  enrichPrices,
  compareYards,
  MSP_2025,
} from '../utils/yardData.js'

function ok(res, data, meta = {}) {
  return res.json({ success: true, data, meta: { ...meta, timestamp: new Date().toISOString() } })
}
function err(res, status, msg) {
  return res.status(status).json({ success: false, message: msg })
}

// ══════════════════════════════════════════════════════════
//  NEW: YARD-BASED ENDPOINTS
// ══════════════════════════════════════════════════════════

// GET /api/v1/market/nearest?state=Gujarat&district=Gir+Somnath&taluka=Kodinar&village=Simar
export function getNearestYardsController(req, res) {
  try {
    const { state, district, taluka, village } = req.query
    const yards = getNearestYards({ state, district, taluka, village })
    return ok(res, {
      yards,
      nearestYard:     yards[0] || null,
      matchedLocation: village || taluka || district || state || 'India',
      total:           yards.length,
    })
  } catch (e) {
    return err(res, 500, 'Failed to compute nearest yards')
  }
}

// GET /api/v1/market/yards?state=Gujarat&district=Gir+Somnath&taluka=Kodinar
export function getYardsController(req, res) {
  try {
    const { state, district, taluka } = req.query
    let yards = [...YARDS]
    if (state && state !== 'All')
      yards = yards.filter(y => y.state.toLowerCase() === state.toLowerCase())
    if (district && district !== 'All')
      yards = yards.filter(y => y.district.toLowerCase().includes(district.toLowerCase()))
    if (taluka && taluka !== 'All')
      yards = yards.filter(y =>
        y.taluka.toLowerCase().includes(taluka.toLowerCase()) ||
        y.nearbyTalukas.some(t => t.toLowerCase().includes(taluka.toLowerCase()))
      )
    return ok(res, { yards, total: yards.length })
  } catch (e) {
    return err(res, 500, 'Failed to fetch yards')
  }
}

// GET /api/v1/market/yardprices?yard=kodinar&crop=Groundnut
export function getYardPricesController(req, res) {
  try {
    const { yard, crop } = req.query
    if (!yard) return err(res, 400, 'yard param is required')
    const yardId   = yard.toLowerCase()
    const yardInfo = YARDS.find(y => y.yardId === yardId)
    if (!yardInfo) return err(res, 404, `Yard "${yard}" not found`)
    let prices = YARD_PRICES[yardId] || []
    if (crop && crop !== 'All')
      prices = prices.filter(p => p.commodity.toLowerCase().includes(crop.toLowerCase()))
    const enriched = enrichPrices(prices)
    const history  = YARD_PRICE_HISTORY[yardId] || {}
    const withHistory = enriched.map(p => ({
      ...p,
      priceHistory: history[p.commodity] || null,
      yard:         yardId,
      yardName:     yardInfo.name,
    }))
    return ok(res, {
      yard:   yardInfo,
      prices: withHistory,
      total:  withHistory.length,
      msps:   MSP_2025,
      date:   new Date().toISOString().split('T')[0],
    })
  } catch (e) {
    return err(res, 500, 'Failed to fetch yard prices')
  }
}

// GET /api/v1/market/compare?yard1=kodinar&yard2=junagadh&crop=Groundnut
export function compareYardsController(req, res) {
  try {
    const { yard1, yard2, crop } = req.query
    if (!yard1 || !yard2) return err(res, 400, 'yard1 and yard2 required')
    return ok(res, compareYards(yard1.toLowerCase(), yard2.toLowerCase(), crop || 'All'))
  } catch (e) {
    return err(res, 500, 'Failed to compare yards')
  }
}

// GET /api/v1/market/yardmeta
export function getYardMeta(req, res) {
  const districts = [...new Set(YARDS.map(y => y.district))].sort()
  const talukas   = [...new Set(YARDS.flatMap(y => [y.taluka, ...y.nearbyTalukas]))].sort()
  const states    = [...new Set(YARDS.map(y => y.state))].sort()
  return ok(res, { yards: YARDS, districts, talukas, states, msps: MSP_2025 })
}

// ══════════════════════════════════════════════════════════
//  EXISTING ENDPOINTS (unchanged)
// ══════════════════════════════════════════════════════════

export async function getMandiPrices(req, res) {
  try {
    const { state, commodity, search, limit } = req.query
    const data = await fetchMandiPrices({
      state: state || 'All India', commodity: commodity || 'All',
      search: search || '', limit: Math.min(parseInt(limit, 10) || 100, 200),
    })
    return ok(res, data)
  } catch (e) { return err(res, 500, 'Failed to fetch mandi prices') }
}

export async function getMarketSummaryController(req, res) {
  try { return ok(res, getMarketSummary()) }
  catch (e) { return err(res, 500, 'Failed to fetch summary') }
}

export async function getCommodityHistoryController(req, res) {
  const { commodity } = req.params
  if (!commodity) return err(res, 400, 'Commodity required')
  const data = getCommodityHistory(commodity)
  if (!data) return err(res, 404, `No history for: ${commodity}`)
  return ok(res, data)
}

export async function getBestMarketsController(req, res) {
  const { commodity } = req.params
  const topN = Math.min(parseInt(req.query.top, 10) || 5, 10)
  if (!commodity) return err(res, 400, 'Commodity required')
  return ok(res, getBestMarkets(commodity, topN))
}

export async function getMarketMeta(req, res) {
  return ok(res, { states: INDIAN_STATES, commodities: COMMODITIES })
}

export function getSchemes(req, res) {
  try {
    const { category, state, search } = req.query
    return ok(res, { schemes: filterSchemes({ category, state, search }), total: 0 })
  } catch (e) { return err(res, 500, 'Failed') }
}

export function getSchemesStats(req, res) { return ok(res, getSchemeStats()) }

export function getSchemeByIdController(req, res) {
  const scheme = getSchemeById(req.params.id)
  if (!scheme) return err(res, 404, `Not found: ${req.params.id}`)
  return ok(res, scheme)
}

export function getSchemeRecommendations(req, res) {
  try {
    const profile = req.body || {}
    if (profile.farmSizeHa) profile.isSmallMarginal = parseFloat(profile.farmSizeHa) <= 2
    return ok(res, getPersonalizedRecommendations(profile))
  } catch (e) { return err(res, 500, 'Failed') }
}
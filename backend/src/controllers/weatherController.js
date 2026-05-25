// backend/src/controllers/weatherController.js
// ─────────────────────────────────────────────────────────
// Weather API controller — wraps the weather service.
// Handles all validation, error formatting, and response shaping.
// ─────────────────────────────────────────────────────────

import {
  getWeatherBundle,
  geocodeCity,
} from '../services/weatherService.js'

// ── Helpers ───────────────────────────────────────────────
function success(res, data, meta = {}) {
  return res.json({ success: true, data, meta: { ...meta, timestamp: new Date().toISOString() } })
}

function error(res, statusCode, message) {
  return res.status(statusCode).json({ success: false, message })
}

// ── GET /api/weather?lat=&lon= ────────────────────────────
// Full weather bundle: current + 7-day + hourly + farming tips
export async function getWeather(req, res) {
  try {
    const lat = parseFloat(req.query.lat)
    const lon = parseFloat(req.query.lon)

    if (isNaN(lat) || isNaN(lon))
      return error(res, 400, 'lat and lon query params are required and must be numbers')
    if (lat < -90 || lat > 90)
      return error(res, 400, 'lat must be between -90 and 90')
    if (lon < -180 || lon > 180)
      return error(res, 400, 'lon must be between -180 and 180')

    const bundle = await getWeatherBundle(lat, lon)
    return success(res, bundle, { cached: true })
  } catch (err) {
    console.error('Weather controller error:', err.message)
    return error(res, 502, 'Failed to fetch weather data. Please try again.')
  }
}

// ── GET /api/weather/current?lat=&lon= ───────────────────
export async function getCurrentWeather(req, res) {
  try {
    const lat = parseFloat(req.query.lat)
    const lon = parseFloat(req.query.lon)
    if (isNaN(lat) || isNaN(lon)) return error(res, 400, 'lat and lon required')

    const bundle = await getWeatherBundle(lat, lon)
    return success(res, { current: bundle.current, meta: bundle.meta })
  } catch (err) {
    return error(res, 502, 'Failed to fetch current weather')
  }
}

// ── GET /api/weather/forecast?lat=&lon= ──────────────────
export async function getForecast(req, res) {
  try {
    const lat = parseFloat(req.query.lat)
    const lon = parseFloat(req.query.lon)
    if (isNaN(lat) || isNaN(lon)) return error(res, 400, 'lat and lon required')

    const bundle = await getWeatherBundle(lat, lon)
    return success(res, { daily: bundle.daily, hourly: bundle.hourly, meta: bundle.meta })
  } catch (err) {
    return error(res, 502, 'Failed to fetch forecast')
  }
}

// ── GET /api/weather/farming?lat=&lon= ───────────────────
export async function getFarmingAdvice(req, res) {
  try {
    const lat = parseFloat(req.query.lat)
    const lon = parseFloat(req.query.lon)
    if (isNaN(lat) || isNaN(lon)) return error(res, 400, 'lat and lon required')

    const bundle = await getWeatherBundle(lat, lon)
    return success(res, { farming: bundle.farming, current: bundle.current, meta: bundle.meta })
  } catch (err) {
    return error(res, 502, 'Failed to fetch farming advice')
  }
}

// ── GET /api/weather/geocode?city= ───────────────────────
export async function geocode(req, res) {
  try {
    const { city } = req.query
    if (!city?.trim()) return error(res, 400, 'city query param is required')

    const results = await geocodeCity(city.trim())
    if (!results?.length) return error(res, 404, `No location found for "${city}"`)

    return success(res, results)
  } catch (err) {
    return error(res, 502, 'Geocoding failed')
  }
}

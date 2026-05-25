// src/controllers/weatherController.js
// ─────────────────────────────────────────────────────────
// Proxies OpenWeatherMap API calls.
// Why proxy instead of calling from frontend directly?
//   • Hides API key
//   • Adds server-side caching (future)
//   • Allows normalising the response shape
// ─────────────────────────────────────────────────────────

import axios from 'axios'
import { ApiResponse } from '../utils/ApiResponse.js'
import { ApiError } from '../utils/ApiError.js'
import asyncHandler from '../utils/asyncHandler.js'
import logger from '../utils/logger.js'
import env from '../config/env.js'

// In-memory cache (replace with Redis in production)
const cache = new Map()
const CACHE_TTL_MS = 10 * 60 * 1000   // 10 minutes

function getCached(key) {
  const entry = cache.get(key)
  if (!entry) return null
  if (Date.now() > entry.expiresAt) { cache.delete(key); return null }
  return entry.data
}
function setCache(key, data) {
  cache.set(key, { data, expiresAt: Date.now() + CACHE_TTL_MS })
}

// ── GET /api/v1/weather/current?lat=&lon= ────────────────
export const getCurrent = asyncHandler(async (req, res) => {
  if (!env.OPENWEATHER_API_KEY) {
    throw ApiError.serviceUnavailable('Weather service not configured')
  }

  const { lat, lon } = req.query
  const cacheKey = `current:${lat}:${lon}`

  const cached = getCached(cacheKey)
  if (cached) {
    return ApiResponse.success(res, { message: 'Current weather', data: cached, meta: { cached: true } })
  }

  try {
    const { data } = await axios.get(`${env.OPENWEATHER_BASE_URL}/weather`, {
      params: { lat, lon, appid: env.OPENWEATHER_API_KEY, units: 'metric' },
      timeout: 8000,
    })

    const normalised = {
      city:        data.name,
      country:     data.sys.country,
      temperature: data.main.temp,
      feelsLike:   data.main.feels_like,
      humidity:    data.main.humidity,
      pressure:    data.main.pressure,
      windSpeed:   data.wind.speed,
      windDeg:     data.wind.deg,
      weather:     data.weather[0].main,
      description: data.weather[0].description,
      icon:        data.weather[0].icon,
      visibility:  data.visibility,
      sunrise:     data.sys.sunrise,
      sunset:      data.sys.sunset,
      updatedAt:   new Date().toISOString(),
    }

    setCache(cacheKey, normalised)
    ApiResponse.success(res, { message: 'Current weather', data: normalised })

  } catch (err) {
    logger.error(`OpenWeather API error: ${err.message}`)
    if (err.response?.status === 401) throw ApiError.internal('Weather service authentication failed')
    if (err.response?.status === 404) throw ApiError.notFound('Weather data for this location')
    throw ApiError.serviceUnavailable('Weather service temporarily unavailable')
  }
})

// ── GET /api/v1/weather/forecast?lat=&lon= ────────────────
export const getForecast = asyncHandler(async (req, res) => {
  if (!env.OPENWEATHER_API_KEY) {
    throw ApiError.serviceUnavailable('Weather service not configured')
  }

  const { lat, lon } = req.query
  const cacheKey = `forecast:${lat}:${lon}`

  const cached = getCached(cacheKey)
  if (cached) {
    return ApiResponse.success(res, { message: '7-day forecast', data: cached, meta: { cached: true } })
  }

  try {
    const { data } = await axios.get(`${env.OPENWEATHER_BASE_URL}/forecast`, {
      params: { lat, lon, appid: env.OPENWEATHER_API_KEY, units: 'metric', cnt: 40 },
      timeout: 8000,
    })

    // Group by day and pick the noon reading
    const byDay = {}
    data.list.forEach(item => {
      const day = item.dt_txt.split(' ')[0]
      if (!byDay[day] || item.dt_txt.includes('12:00')) byDay[day] = item
    })

    const forecast = Object.values(byDay).slice(0, 7).map(item => ({
      date:        item.dt_txt.split(' ')[0],
      temp:        item.main.temp,
      tempMin:     item.main.temp_min,
      tempMax:     item.main.temp_max,
      humidity:    item.main.humidity,
      weather:     item.weather[0].main,
      description: item.weather[0].description,
      icon:        item.weather[0].icon,
      rainChance:  Math.round((item.pop || 0) * 100),
      windSpeed:   item.wind.speed,
    }))

    setCache(cacheKey, forecast)
    ApiResponse.success(res, { message: '7-day forecast', data: forecast })

  } catch (err) {
    logger.error(`OpenWeather forecast error: ${err.message}`)
    throw ApiError.serviceUnavailable('Forecast service temporarily unavailable')
  }
})

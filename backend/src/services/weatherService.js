// backend/src/services/weatherService.js
// ─────────────────────────────────────────────────────────
// Weather data service using Open-Meteo API (100% free, no API key).
// Docs: https://open-meteo.com/en/docs
//
// Also uses Open-Meteo Geocoding API for location search.
// Combined with WMO weather code mapping for human-readable conditions.
//
// Features:
//   • Current conditions (temperature, humidity, wind, UV, pressure)
//   • 7-day daily forecast with min/max/rain probability
//   • Hourly data for the next 24 hours
//   • Soil temperature & moisture (agri-specific)
//   • WMO weather condition codes → labels + icons
//   • In-memory cache with 10-minute TTL (avoids hammering free API)
// ─────────────────────────────────────────────────────────

import axios from 'axios'

// ── API base URLs (no key required) ──────────────────────
const OPEN_METEO_BASE    = 'https://api.open-meteo.com/v1'
const GEOCODING_BASE     = 'https://geocoding-api.open-meteo.com/v1'
const AIR_QUALITY_BASE   = 'https://air-quality-api.open-meteo.com/v1'

// ── In-memory cache (replace with Redis in production) ───
const cache  = new Map()
const TTL_MS = 10 * 60 * 1000  // 10 minutes

function cached(key) {
  const e = cache.get(key)
  if (!e || Date.now() > e.exp) { cache.delete(key); return null }
  return e.data
}
function setCache(key, data) {
  cache.set(key, { data, exp: Date.now() + TTL_MS })
}

// ── WMO Weather Interpretation Codes ─────────────────────
// https://open-meteo.com/en/docs#weathervariables
export const WMO_CODES = {
  0:  { label: 'Clear Sky',            icon: 'sun',            severity: 'clear'   },
  1:  { label: 'Mainly Clear',         icon: 'sun-cloud',      severity: 'clear'   },
  2:  { label: 'Partly Cloudy',        icon: 'cloud',          severity: 'clear'   },
  3:  { label: 'Overcast',             icon: 'cloud',          severity: 'cloudy'  },
  45: { label: 'Foggy',                icon: 'fog',            severity: 'fog'     },
  48: { label: 'Rime Fog',             icon: 'fog',            severity: 'fog'     },
  51: { label: 'Light Drizzle',        icon: 'drizzle',        severity: 'rain'    },
  53: { label: 'Moderate Drizzle',     icon: 'drizzle',        severity: 'rain'    },
  55: { label: 'Dense Drizzle',        icon: 'drizzle',        severity: 'rain'    },
  61: { label: 'Light Rain',           icon: 'rain',           severity: 'rain'    },
  63: { label: 'Moderate Rain',        icon: 'rain',           severity: 'rain'    },
  65: { label: 'Heavy Rain',           icon: 'rain-heavy',     severity: 'rain'    },
  71: { label: 'Light Snowfall',       icon: 'snow',           severity: 'snow'    },
  73: { label: 'Moderate Snowfall',    icon: 'snow',           severity: 'snow'    },
  75: { label: 'Heavy Snowfall',       icon: 'snow',           severity: 'snow'    },
  77: { label: 'Snow Grains',          icon: 'snow',           severity: 'snow'    },
  80: { label: 'Light Rain Showers',   icon: 'shower',         severity: 'rain'    },
  81: { label: 'Rain Showers',         icon: 'shower',         severity: 'rain'    },
  82: { label: 'Violent Rain Showers', icon: 'rain-heavy',     severity: 'storm'   },
  85: { label: 'Snow Showers',         icon: 'snow',           severity: 'snow'    },
  86: { label: 'Heavy Snow Showers',   icon: 'snow',           severity: 'snow'    },
  95: { label: 'Thunderstorm',         icon: 'thunder',        severity: 'storm'   },
  96: { label: 'Thunderstorm + Hail',  icon: 'thunder',        severity: 'storm'   },
  99: { label: 'Thunderstorm + Heavy Hail', icon: 'thunder',   severity: 'storm'   },
}

// ── Wind direction: degrees → compass ────────────────────
export function degreesToCompass(deg) {
  const dirs = ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW']
  return dirs[Math.round(deg / 22.5) % 16]
}

// ── UV Index label ────────────────────────────────────────
export function uvLabel(uv) {
  if (uv <= 2)  return { label: 'Low',       color: 'green'  }
  if (uv <= 5)  return { label: 'Moderate',  color: 'yellow' }
  if (uv <= 7)  return { label: 'High',      color: 'orange' }
  if (uv <= 10) return { label: 'Very High', color: 'red'    }
  return                { label: 'Extreme',  color: 'purple' }
}

// ── Farming recommendations based on conditions ───────────
export function getFarmingAdvice(current, daily) {
  const alerts  = []
  const tips    = []

  const temp     = current.temperature_2m
  const humidity = current.relative_humidity_2m
  const rain     = current.rain
  const wind     = current.wind_speed_10m
  const uv       = current.uv_index
  const wmoCode  = WMO_CODES[current.weather_code] || WMO_CODES[0]

  // Temperature advisories
  if (temp > 38)  alerts.push({ type: 'danger',  icon: 'thermometer', text: 'Extreme heat — delay planting, irrigate early morning or evening' })
  if (temp > 32)  tips.push(  { type: 'warning', icon: 'sun',         text: 'High heat stress — increase irrigation frequency for standing crops' })
  if (temp < 5)   alerts.push({ type: 'danger',  icon: 'snowflake',   text: 'Near-frost conditions — protect sensitive crops and seedlings' })
  if (temp < 10)  tips.push(  { type: 'warning', icon: 'thermometer', text: 'Cool temperatures — germination will be slow, cover vulnerable plants' })

  // Rain & irrigation
  if (wmoCode.severity === 'storm')
    alerts.push({ type: 'danger', icon: 'thunder', text: 'Thunderstorm — avoid field operations, secure equipment and covers' })
  if (wmoCode.severity === 'rain' && rain > 20)
    alerts.push({ type: 'warning', icon: 'rain',  text: 'Heavy rain — suspend irrigation, watch for waterlogging and runoff' })
  if (humidity > 85)
    tips.push({ type: 'warning', icon: 'droplets', text: 'High humidity — elevated risk of fungal disease (blight, mildew). Scout crops today.' })
  if (humidity < 30)
    tips.push({ type: 'info',    icon: 'droplets', text: 'Low humidity — increase irrigation and consider mulching to retain soil moisture' })

  // Wind
  if (wind > 40)  alerts.push({ type: 'danger',  icon: 'wind',  text: 'Strong winds — avoid spraying pesticides/herbicides, risk of drift damage' })
  if (wind > 25)  tips.push(  { type: 'warning', icon: 'wind',  text: 'Moderate winds — delay spraying operations until wind drops below 15 km/h' })

  // UV / spraying window
  if (uv >= 8)    tips.push({ type: 'info', icon: 'sun',  text: 'High UV — best spray window is before 9 AM or after 5 PM to reduce evaporation' })

  // 7-day forecast tips
  const nextRainDay = daily?.time?.findIndex((_, i) => (daily?.precipitation_probability_max?.[i] || 0) > 60)
  if (nextRainDay >= 0 && nextRainDay <= 2)
    tips.push({ type: 'info', icon: 'calendar', text: `Rain likely in ${nextRainDay === 0 ? 'today' : nextRainDay + ' day(s)'} — plan fertiliser applications before rain for best uptake` })

  // Default positive tip if all clear
  if (alerts.length === 0 && tips.length === 0) {
    tips.push({ type: 'success', icon: 'leaf', text: 'Conditions are favourable — good day for field operations, sowing, or transplanting' })
  }

  return { alerts, tips }
}

// ── Geocoding: city name → { lat, lon, name, country } ───
export async function geocodeCity(city) {
  const cacheKey = `geo:${city.toLowerCase()}`
  const hit = cached(cacheKey)
  if (hit) return hit

  const { data } = await axios.get(`${GEOCODING_BASE}/search`, {
    params: { name: city, count: 5, language: 'en', format: 'json' },
    timeout: 8000,
  })

  if (!data.results?.length) return null

  const results = data.results.map(r => ({
    name:      r.name,
    country:   r.country,
    countryCode: r.country_code,
    state:     r.admin1 || '',
    lat:       r.latitude,
    lon:       r.longitude,
  }))

  setCache(cacheKey, results)
  return results
}

// ── Main: get full weather bundle for lat/lon ─────────────
export async function getWeatherBundle(lat, lon) {
  const cacheKey = `weather:${Math.round(lat * 100)}:${Math.round(lon * 100)}`
  const hit = cached(cacheKey)
  if (hit) return hit

  // Parallel requests to Open-Meteo
  const [weatherRes, airRes] = await Promise.allSettled([

    // Primary weather data
    axios.get(`${OPEN_METEO_BASE}/forecast`, {
      params: {
        latitude:  lat,
        longitude: lon,
        timezone:  'auto',

        // Current conditions
        current: [
          'temperature_2m', 'relative_humidity_2m', 'apparent_temperature',
          'is_day', 'precipitation', 'rain', 'weather_code',
          'cloud_cover', 'pressure_msl', 'surface_pressure',
          'wind_speed_10m', 'wind_direction_10m', 'wind_gusts_10m',
          'uv_index', 'uv_index_clear_sky',
        ].join(','),

        // Hourly (next 24h)
        hourly: [
          'temperature_2m', 'relative_humidity_2m', 'precipitation_probability',
          'precipitation', 'weather_code', 'wind_speed_10m',
          'soil_temperature_0cm', 'soil_moisture_0_to_1cm',
        ].join(','),
        forecast_hours: 24,

        // Daily (7-day)
        daily: [
          'weather_code', 'temperature_2m_max', 'temperature_2m_min',
          'apparent_temperature_max', 'apparent_temperature_min',
          'sunrise', 'sunset', 'uv_index_max',
          'precipitation_sum', 'rain_sum', 'precipitation_hours',
          'precipitation_probability_max', 'precipitation_probability_mean',
          'wind_speed_10m_max', 'wind_gusts_10m_max',
          'wind_direction_10m_dominant', 'shortwave_radiation_sum',
          'et0_fao_evapotranspiration',
        ].join(','),
        forecast_days: 7,

        wind_speed_unit: 'kmh',
        temperature_unit: 'celsius',
        precipitation_unit: 'mm',
      },
      timeout: 12000,
    }),

    // Air quality (separate endpoint)
    axios.get(`${AIR_QUALITY_BASE}/air-quality`, {
      params: {
        latitude:  lat,
        longitude: lon,
        current:   'pm10,pm2_5,carbon_monoxide,european_aqi',
        timezone:  'auto',
      },
      timeout: 8000,
    }),
  ])

  if (weatherRes.status === 'rejected') {
    throw new Error(`Weather API error: ${weatherRes.reason?.message}`)
  }

  const w   = weatherRes.value.data
  const air = airRes.status === 'fulfilled' ? airRes.value.data : null

  // ── Normalise current conditions ──
  const current = {
    ...w.current,
    wind_direction_compass: degreesToCompass(w.current.wind_direction_10m),
    uv_label:               uvLabel(w.current.uv_index),
    condition:              WMO_CODES[w.current.weather_code] || WMO_CODES[0],
    air_quality:            air?.current || null,
  }

  // ── Normalise 7-day daily forecast ──
  const daily = w.daily.time.map((date, i) => ({
    date,
    dayName:          new Date(date + 'T12:00:00').toLocaleDateString('en-IN', { weekday: 'short' }),
    dateLabel:        new Date(date + 'T12:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
    condition:        WMO_CODES[w.daily.weather_code[i]] || WMO_CODES[0],
    tempMax:          w.daily.temperature_2m_max[i],
    tempMin:          w.daily.temperature_2m_min[i],
    feelsMax:         w.daily.apparent_temperature_max[i],
    feelsMin:         w.daily.apparent_temperature_min[i],
    sunrise:          w.daily.sunrise[i],
    sunset:           w.daily.sunset[i],
    uvMax:            w.daily.uv_index_max[i],
    precipSum:        w.daily.precipitation_sum[i],
    rainSum:          w.daily.rain_sum[i],
    precipHours:      w.daily.precipitation_hours[i],
    rainChance:       w.daily.precipitation_probability_max[i],
    rainChanceMean:   w.daily.precipitation_probability_mean[i],
    windMax:          w.daily.wind_speed_10m_max[i],
    windGust:         w.daily.wind_gusts_10m_max[i],
    windDir:          degreesToCompass(w.daily.wind_direction_10m_dominant[i]),
    radiation:        w.daily.shortwave_radiation_sum[i],
    evapotranspiration: w.daily.et0_fao_evapotranspiration[i],
  }))

  // ── Normalise 24h hourly ──
  const hourly = w.hourly.time.map((time, i) => ({
    time,
    hour:          new Date(time).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }),
    temp:          w.hourly.temperature_2m[i],
    humidity:      w.hourly.relative_humidity_2m[i],
    rainChance:    w.hourly.precipitation_probability[i],
    precip:        w.hourly.precipitation[i],
    condition:     WMO_CODES[w.hourly.weather_code[i]] || WMO_CODES[0],
    windSpeed:     w.hourly.wind_speed_10m[i],
    soilTemp:      w.hourly.soil_temperature_0cm[i],
    soilMoisture:  w.hourly.soil_moisture_0_to_1cm[i],
  }))

  // ── Build farming recommendations ──
  const farming = getFarmingAdvice(w.current, w.daily)

  const bundle = {
    meta: {
      lat:       w.latitude,
      lon:       w.longitude,
      elevation: w.elevation,
      timezone:  w.timezone,
      generatedAt: new Date().toISOString(),
    },
    current,
    daily,
    hourly,
    farming,
  }

  setCache(cacheKey, bundle)
  return bundle
}

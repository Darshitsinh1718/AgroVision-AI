// frontend/src/services/weatherApi.js
// ─────────────────────────────────────────────────────────
// Weather API service layer for the frontend.
// Primary: calls own backend (/api/weather)
// Fallback: hits Open-Meteo directly (if no backend available)
//
// All functions return normalized data objects — components
// never need to know which source was used.
// ─────────────────────────────────────────────────────────

const BACKEND_BASE    = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const OPEN_METEO_BASE = 'https://api.open-meteo.com/v1'
const GEOCODING_BASE  = 'https://geocoding-api.open-meteo.com/v1'

// ── Default location: Junagadh, Gujarat (agri region) ────
export const DEFAULT_LOCATION = {
  name:    'Junagadh',
  state:   'Gujarat',
  country: 'India',
  lat:     21.5222,
  lon:     70.4579,
}

// ── WMO codes (client-side copy for offline use) ─────────
export const WMO_CODES = {
  0:  { label: 'Clear Sky',            icon: 'sun',        severity: 'clear'  },
  1:  { label: 'Mainly Clear',         icon: 'sun-cloud',  severity: 'clear'  },
  2:  { label: 'Partly Cloudy',        icon: 'cloud',      severity: 'clear'  },
  3:  { label: 'Overcast',             icon: 'cloud',      severity: 'cloudy' },
  45: { label: 'Foggy',               icon: 'fog',        severity: 'fog'    },
  48: { label: 'Rime Fog',            icon: 'fog',        severity: 'fog'    },
  51: { label: 'Light Drizzle',       icon: 'drizzle',    severity: 'rain'   },
  53: { label: 'Moderate Drizzle',    icon: 'drizzle',    severity: 'rain'   },
  55: { label: 'Dense Drizzle',       icon: 'drizzle',    severity: 'rain'   },
  61: { label: 'Light Rain',          icon: 'rain',       severity: 'rain'   },
  63: { label: 'Moderate Rain',       icon: 'rain',       severity: 'rain'   },
  65: { label: 'Heavy Rain',          icon: 'rain-heavy', severity: 'rain'   },
  71: { label: 'Light Snow',          icon: 'snow',       severity: 'snow'   },
  73: { label: 'Moderate Snow',       icon: 'snow',       severity: 'snow'   },
  75: { label: 'Heavy Snow',          icon: 'snow',       severity: 'snow'   },
  80: { label: 'Rain Showers',        icon: 'shower',     severity: 'rain'   },
  81: { label: 'Rain Showers',        icon: 'shower',     severity: 'rain'   },
  82: { label: 'Violent Showers',     icon: 'rain-heavy', severity: 'storm'  },
  95: { label: 'Thunderstorm',        icon: 'thunder',    severity: 'storm'  },
  96: { label: 'Storm + Hail',        icon: 'thunder',    severity: 'storm'  },
  99: { label: 'Storm + Heavy Hail',  icon: 'thunder',    severity: 'storm'  },
}

function wmo(code) { return WMO_CODES[code] || WMO_CODES[0] }
function compass(deg) {
  const d = ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW']
  return d[Math.round(deg / 22.5) % 16]
}

// ── Farming advice (client-side — mirrors backend logic) ──
export function buildFarmingAdvice(current, daily) {
  const alerts = []
  const tips   = []
  const temp     = current.temperature_2m
  const humidity = current.relative_humidity_2m
  const wind     = current.wind_speed_10m
  const uv       = current.uv_index
  const severity = wmo(current.weather_code).severity

  if (temp > 38)     alerts.push({ type: 'danger',  icon: 'thermometer', text: 'Extreme heat — delay planting, irrigate early morning or evening only' })
  else if (temp > 32) tips.push( { type: 'warning', icon: 'sun',         text: 'High heat stress — increase irrigation frequency for standing crops' })
  if (temp < 5)      alerts.push({ type: 'danger',  icon: 'snowflake',   text: 'Near-frost — protect sensitive crops and seedlings immediately' })
  if (severity === 'storm') alerts.push({ type: 'danger', icon: 'thunder', text: 'Thunderstorm active — avoid all field operations, secure equipment' })
  if (humidity > 85)  tips.push({ type: 'warning', icon: 'droplets',     text: 'High humidity — elevated fungal disease risk. Scout for blight and mildew.' })
  if (humidity < 30)  tips.push({ type: 'info',    icon: 'droplets',     text: 'Low humidity — increase irrigation and mulch to retain soil moisture' })
  if (wind > 40)     alerts.push({ type: 'danger',  icon: 'wind',        text: 'Strong winds — avoid spraying, risk of pesticide drift damage' })
  else if (wind > 25) tips.push( { type: 'warning', icon: 'wind',        text: 'Moderate winds — delay spray operations until wind drops below 15 km/h' })
  if (uv >= 8)        tips.push( { type: 'info',    icon: 'sun',         text: 'High UV — best spray window before 9 AM or after 5 PM' })

  if (daily) {
    const rainIdx = daily.rainChance?.findIndex(p => p > 60) ?? -1
    if (rainIdx >= 0 && rainIdx <= 2) {
      tips.push({ type: 'info', icon: 'calendar', text: `Rain likely in ${rainIdx === 0 ? 'today' : rainIdx + ' day(s)'} — apply fertilisers now for best uptake before rain` })
    }
  }

  if (alerts.length === 0 && tips.length === 0) {
    tips.push({ type: 'success', icon: 'leaf', text: 'Conditions are favourable — good day for field operations, sowing, or transplanting' })
  }
  return { alerts, tips }
}

// ── Direct Open-Meteo fetch (fallback / client-side use) ──
export async function fetchWeatherDirect(lat, lon) {
  const [weatherRes, airRes] = await Promise.allSettled([
    fetch(`${OPEN_METEO_BASE}/forecast?` + new URLSearchParams({
      latitude: lat, longitude: lon, timezone: 'auto',
      current: 'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,weather_code,cloud_cover,pressure_msl,wind_speed_10m,wind_direction_10m,wind_gusts_10m,uv_index',
      hourly:  'temperature_2m,relative_humidity_2m,precipitation_probability,precipitation,weather_code,wind_speed_10m,soil_temperature_0cm,soil_moisture_0_to_1cm',
      daily:   'weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,uv_index_max,precipitation_sum,rain_sum,precipitation_hours,precipitation_probability_max,precipitation_probability_mean,wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant,shortwave_radiation_sum,et0_fao_evapotranspiration',
      forecast_days: 7, forecast_hours: 24,
      wind_speed_unit: 'kmh', precipitation_unit: 'mm',
    })).then(r => r.json()),

    fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?` + new URLSearchParams({
      latitude: lat, longitude: lon, timezone: 'auto',
      current: 'pm10,pm2_5,european_aqi',
    })).then(r => r.json()),
  ])

  const w   = weatherRes.status === 'fulfilled' ? weatherRes.value : null
  const air = airRes.status    === 'fulfilled'  ? airRes.value    : null
  if (!w) throw new Error('Open-Meteo API unavailable')

  // normalise
  const current = {
    ...w.current,
    condition:              wmo(w.current.weather_code),
    wind_direction_compass: compass(w.current.wind_direction_10m),
    uv_label:               uvLabel(w.current.uv_index),
    air_quality:            air?.current || null,
  }

  const daily = w.daily.time.map((date, i) => ({
    date,
    dayName:      new Date(date + 'T12:00:00').toLocaleDateString('en-IN', { weekday: 'short' }),
    dateLabel:    new Date(date + 'T12:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
    condition:    wmo(w.daily.weather_code[i]),
    tempMax:      w.daily.temperature_2m_max[i],
    tempMin:      w.daily.temperature_2m_min[i],
    feelsMax:     w.daily.apparent_temperature_max[i],
    feelsMin:     w.daily.apparent_temperature_min[i],
    sunrise:      w.daily.sunrise[i],
    sunset:       w.daily.sunset[i],
    uvMax:        w.daily.uv_index_max[i],
    precipSum:    w.daily.precipitation_sum[i],
    rainSum:      w.daily.rain_sum[i],
    rainChance:   w.daily.precipitation_probability_max[i],
    windMax:      w.daily.wind_speed_10m_max[i],
    windGust:     w.daily.wind_gusts_10m_max[i],
    windDir:      compass(w.daily.wind_direction_10m_dominant[i]),
    evapotranspiration: w.daily.et0_fao_evapotranspiration[i],
  }))

  const hourly = w.hourly.time.slice(0, 24).map((time, i) => ({
    time,
    hour:        new Date(time).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }),
    temp:        w.hourly.temperature_2m[i],
    humidity:    w.hourly.relative_humidity_2m[i],
    rainChance:  w.hourly.precipitation_probability[i],
    precip:      w.hourly.precipitation[i],
    condition:   wmo(w.hourly.weather_code[i]),
    windSpeed:   w.hourly.wind_speed_10m[i],
    soilTemp:    w.hourly.soil_temperature_0cm?.[i],
    soilMoisture: w.hourly.soil_moisture_0_to_1cm?.[i],
  }))

  const farming = buildFarmingAdvice(w.current, { rainChance: w.daily.precipitation_probability_max })

  return {
    meta:    { lat: w.latitude, lon: w.longitude, timezone: w.timezone, generatedAt: new Date().toISOString() },
    current, daily, hourly, farming,
  }
}

function uvLabel(uv) {
  if (uv <= 2)  return { label: 'Low',       color: 'green'  }
  if (uv <= 5)  return { label: 'Moderate',  color: 'yellow' }
  if (uv <= 7)  return { label: 'High',      color: 'orange' }
  if (uv <= 10) return { label: 'Very High', color: 'red'    }
  return               { label: 'Extreme',   color: 'purple' }
}

// ── Geocoding: city → locations ───────────────────────────
export async function searchCity(query) {
  const res  = await fetch(`${GEOCODING_BASE}/search?name=${encodeURIComponent(query)}&count=6&language=en&format=json`)
  const data = await res.json()
  if (!data.results?.length) return []
  return data.results.map(r => ({
    name: r.name, country: r.country, state: r.admin1 || '',
    lat: r.latitude, lon: r.longitude,
  }))
}

// ── Main export: fetch weather (tries backend, falls back) ─
export async function fetchWeather(lat, lon) {
  // Try backend first
  try {
    const res  = await fetch(`${BACKEND_BASE}/weather?lat=${lat}&lon=${lon}`, { signal: AbortSignal.timeout(6000) })
    const json = await res.json()
    if (json.success && json.data) return json.data
  } catch { /* fall through to direct */ }

  // Direct Open-Meteo fallback
  return fetchWeatherDirect(lat, lon)
}

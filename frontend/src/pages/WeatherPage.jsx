// // src/pages/WeatherPage.jsx
// import { CloudSun, Wind, Droplets, Thermometer, Eye, Gauge } from 'lucide-react'
// import { PageHeader } from '@/components/ui/PageHeader'
// import { Card, StatCard } from '@/components/ui/Card'

// const FORECAST = [
//   { day: 'Today',  icon: '☀️', high: 32, low: 22, rain: 5  },
//   { day: 'Tue',    icon: '⛅', high: 30, low: 21, rain: 20 },
//   { day: 'Wed',    icon: '🌧️', high: 27, low: 19, rain: 80 },
//   { day: 'Thu',    icon: '🌧️', high: 26, low: 18, rain: 90 },
//   { day: 'Fri',    icon: '⛅', high: 28, low: 20, rain: 35 },
//   { day: 'Sat',    icon: '☀️', high: 31, low: 21, rain: 10 },
//   { day: 'Sun',    icon: '☀️', high: 33, low: 23, rain: 5  },
// ]

// export default function WeatherPage() {
//   return (
//     <div className="animate-fade-in space-y-6">
//       <PageHeader badge="Live Data" title="Weather Forecast" subtitle="Hyperlocal 7-day forecast for your farm location — Junagadh, Gujarat." />

//       <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
//         {FORECAST.map(d => (
//           <Card key={d.day} className="p-4 text-center flex flex-col items-center gap-2" hover>
//             <span className="text-xs font-medium text-stone-500">{d.day}</span>
//             <span className="text-2xl">{d.icon}</span>
//             <div className="text-sm">
//               <span className="text-stone-200 font-medium">{d.high}°</span>
//               <span className="text-stone-600 ml-1">{d.low}°</span>
//             </div>
//             <div className="flex items-center gap-1 text-sky-400 text-2xs">
//               <Droplets size={10} />{d.rain}%
//             </div>
//           </Card>
//         ))}
//       </div>

//       <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//         <StatCard label="Wind Speed"  value="12"  unit="km/h" icon={Wind}        iconColor="text-stone-300" iconBg="bg-stone-800" />
//         <StatCard label="Humidity"    value="68"  unit="%"    icon={Droplets}    iconColor="text-sky-400"   iconBg="bg-sky-950"   />
//         <StatCard label="Visibility"  value="8.4" unit="km"   icon={Eye}         iconColor="text-stone-300" iconBg="bg-stone-800" />
//         <StatCard label="Pressure"    value="1013" unit="hPa" icon={Gauge}       iconColor="text-harvest-400" iconBg="bg-harvest-950" />
//       </div>
//     </div>
//   )
// }
// frontend/src/pages/WeatherPage.jsx
// ─────────────────────────────────────────────────────────
// Complete weather dashboard. All sub-components are defined
// in this file for portability. Extract to separate files as needed.
//
// Components inside:
//   WeatherIcon         — animated SVG weather icons
//   WeatherSkeleton     — loading state
//   LocationSearch      — city search with autocomplete
//   CurrentWeatherCard  — hero current conditions
//   HourlyStrip         — 24h horizontal scroll
//   DailyForecast       — 7-day forecast grid
//   MetricGauge         — circular gauge for UV/humidity/wind
//   SoilPanel           — soil temp + moisture data
//   FarmingAlerts       — agricultural advisories
//   AirQualityCard      — AQI display
// ─────────────────────────────────────────────────────────

import { useState, useEffect, useRef, useCallback } from 'react'
import {
  MapPin, RefreshCw, Navigation, Search, X,
  Droplets, Wind, Eye, Gauge, Thermometer,
  Leaf, AlertTriangle, CheckCircle, Info,
  Sunrise, Sunset, Zap, CloudRain, ChevronRight,
  ArrowUp, ArrowDown, Activity
} from 'lucide-react'
import { useWeather } from '../hooks/useWeather.js'
import { searchCity } from '../services/weatherApi.js'
import { cn } from '../utils/cn.js'

// ─────────────────────────────────────────────────────────
// 1. WEATHER ICONS — animated SVG
// ─────────────────────────────────────────────────────────
function WeatherIcon({ type, size = 64, className = '' }) {
  const s = size
  const icons = {
    sun: (
      <svg width={s} height={s} viewBox="0 0 64 64" className={className}>
        <circle cx="32" cy="32" r="12" fill="#FCD34D" className="animate-pulse-slow"/>
        {[0,45,90,135,180,225,270,315].map((deg, i) => (
          <line key={i}
            x1={32 + Math.cos((deg-90)*Math.PI/180)*18}
            y1={32 + Math.sin((deg-90)*Math.PI/180)*18}
            x2={32 + Math.cos((deg-90)*Math.PI/180)*26}
            y2={32 + Math.sin((deg-90)*Math.PI/180)*26}
            stroke="#FCD34D" strokeWidth="2.5" strokeLinecap="round"
            style={{ transformOrigin: '32px 32px', animation: `spin 8s linear infinite` }}
          />
        ))}
      </svg>
    ),
    'sun-cloud': (
      <svg width={s} height={s} viewBox="0 0 64 64" className={className}>
        <circle cx="24" cy="22" r="9" fill="#FCD34D" opacity="0.9"/>
        <ellipse cx="34" cy="38" rx="16" ry="10" fill="#94A3B8"/>
        <ellipse cx="24" cy="40" rx="12" ry="9" fill="#CBD5E1"/>
        <ellipse cx="38" cy="42" rx="10" ry="7" fill="#CBD5E1"/>
      </svg>
    ),
    cloud: (
      <svg width={s} height={s} viewBox="0 0 64 64" className={className}>
        <ellipse cx="32" cy="36" rx="20" ry="12" fill="#94A3B8"/>
        <ellipse cx="24" cy="34" rx="14" ry="11" fill="#CBD5E1"/>
        <ellipse cx="36" cy="38" rx="12" ry="9"  fill="#CBD5E1"/>
        <circle  cx="20" cy="30" r="10" fill="#CBD5E1"/>
        <circle  cx="32" cy="26" r="12" fill="#E2E8F0"/>
      </svg>
    ),
    rain: (
      <svg width={s} height={s} viewBox="0 0 64 64" className={className}>
        <ellipse cx="32" cy="26" rx="20" ry="12" fill="#64748B"/>
        <ellipse cx="22" cy="24" rx="14" ry="10" fill="#94A3B8"/>
        <ellipse cx="36" cy="28" rx="12" ry="9"  fill="#94A3B8"/>
        {[[22,40],[30,44],[38,40],[26,48],[34,48]].map(([x,y], i) => (
          <ellipse key={i} cx={x} cy={y} rx="1.5" ry="4" fill="#38BDF8"
            style={{ animation: `fall 1.2s ease-in infinite`, animationDelay: `${i*0.2}s` }}/>
        ))}
      </svg>
    ),
    'rain-heavy': (
      <svg width={s} height={s} viewBox="0 0 64 64" className={className}>
        <ellipse cx="32" cy="24" rx="20" ry="11" fill="#475569"/>
        <ellipse cx="22" cy="22" rx="14" ry="10" fill="#64748B"/>
        {[[18,38],[25,42],[32,38],[39,42],[46,38],[22,48],[29,52],[36,48],[43,52]].map(([x,y], i) => (
          <ellipse key={i} cx={x} cy={y} rx="1.5" ry="5" fill="#38BDF8"
            style={{ animation: `fall 0.9s ease-in infinite`, animationDelay: `${i*0.1}s` }}/>
        ))}
      </svg>
    ),
    drizzle: (
      <svg width={s} height={s} viewBox="0 0 64 64" className={className}>
        <ellipse cx="32" cy="26" rx="18" ry="10" fill="#94A3B8"/>
        {[[24,40],[32,44],[40,40],[28,50],[36,46]].map(([x,y], i) => (
          <circle key={i} cx={x} cy={y} r="2" fill="#7DD3FC"
            style={{ animation: `fall 1.5s ease-in infinite`, animationDelay: `${i*0.25}s` }}/>
        ))}
      </svg>
    ),
    thunder: (
      <svg width={s} height={s} viewBox="0 0 64 64" className={className}>
        <ellipse cx="32" cy="22" rx="22" ry="13" fill="#374151"/>
        <ellipse cx="22" cy="20" rx="15" ry="11" fill="#4B5563"/>
        <polygon points="34,32 26,44 32,44 28,56 42,40 35,40 40,32"
          fill="#FCD34D" className="animate-pulse-slow"/>
      </svg>
    ),
    snow: (
      <svg width={s} height={s} viewBox="0 0 64 64" className={className}>
        <ellipse cx="32" cy="24" rx="20" ry="11" fill="#94A3B8"/>
        {[[22,40],[32,36],[42,40],[27,50],[37,50]].map(([x,y], i) => (
          <text key={i} x={x-4} y={y+4} fontSize="10" fill="#BAE6FD"
            style={{ animation: `fall 2s ease-in infinite`, animationDelay: `${i*0.3}s` }}>❄</text>
        ))}
      </svg>
    ),
    fog: (
      <svg width={s} height={s} viewBox="0 0 64 64" className={className}>
        {[20,28,36,44].map((y, i) => (
          <rect key={i} x="8" y={y} width={i%2===0?48:40} height="4" rx="2" fill="#94A3B8" opacity="0.6"
            style={{ animation: `pulse 2s ease-in-out infinite`, animationDelay: `${i*0.3}s` }}/>
        ))}
      </svg>
    ),
    shower: (
      <svg width={s} height={s} viewBox="0 0 64 64" className={className}>
        <circle cx="20" cy="18" r="8" fill="#FCD34D" opacity="0.8"/>
        <ellipse cx="36" cy="26" rx="18" ry="10" fill="#94A3B8"/>
        <ellipse cx="28" cy="28" rx="12" ry="9"  fill="#CBD5E1"/>
        {[[26,40],[33,44],[40,40],[30,50]].map(([x,y], i) => (
          <ellipse key={i} cx={x} cy={y} rx="1.5" ry="4" fill="#38BDF8"
            style={{ animation: `fall 1.3s ease-in infinite`, animationDelay: `${i*0.2}s` }}/>
        ))}
      </svg>
    ),
  }
  return icons[type] || icons.cloud
}

// ─────────────────────────────────────────────────────────
// 2. SKELETON
// ─────────────────────────────────────────────────────────
function Skel({ className }) {
  return <div className={cn('rounded-xl bg-white/[0.06] animate-pulse', className)} />
}

function WeatherSkeleton() {
  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <Skel className="h-8 w-48" />
        <Skel className="h-9 w-64 rounded-2xl" />
      </div>
      {/* Current card */}
      <div className="rounded-3xl bg-white/[0.04] border border-white/[0.06] p-7 flex gap-6">
        <Skel className="w-24 h-24 rounded-2xl" />
        <div className="flex-1 space-y-3">
          <Skel className="h-16 w-40" />
          <Skel className="h-5 w-32" />
          <div className="flex gap-4 mt-4">
            {[...Array(4)].map((_, i) => <Skel key={i} className="h-14 w-24 rounded-xl" />)}
          </div>
        </div>
      </div>
      {/* Hourly strip */}
      <div className="flex gap-3 overflow-hidden">
        {[...Array(8)].map((_, i) => <Skel key={i} className="h-24 w-20 flex-shrink-0 rounded-2xl" />)}
      </div>
      {/* Daily grid */}
      <div className="grid grid-cols-7 gap-2">
        {[...Array(7)].map((_, i) => <Skel key={i} className="h-32 rounded-2xl" />)}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// 3. LOCATION SEARCH
// ─────────────────────────────────────────────────────────
function LocationSearch({ onSelect, onGPS, gpsLoading }) {
  const [query,   setQuery]   = useState('')
  const [results, setResults] = useState([])
  const [open,    setOpen]    = useState(false)
  const [loading, setLoading] = useState(false)
  const debounce  = useRef(null)
  const inputRef  = useRef(null)

  const search = useCallback(async (q) => {
    if (q.length < 2) { setResults([]); setOpen(false); return }
    setLoading(true)
    try {
      const r = await searchCity(q)
      setResults(r)
      setOpen(r.length > 0)
    } catch { setResults([]) }
    finally { setLoading(false) }
  }, [])

  const handleInput = (e) => {
    const q = e.target.value
    setQuery(q)
    clearTimeout(debounce.current)
    debounce.current = setTimeout(() => search(q), 350)
  }

  const pick = (loc) => {
    setQuery('')
    setResults([])
    setOpen(false)
    onSelect(loc)
  }

  return (
    <div className="relative flex items-center gap-2">
      {/* GPS button */}
      <button
        onClick={onGPS}
        disabled={gpsLoading}
        title="Detect my location"
        className="flex-shrink-0 w-9 h-9 rounded-xl bg-leaf-900/60 border border-leaf-700/40
                   flex items-center justify-center text-leaf-400
                   hover:bg-leaf-800/60 transition-all duration-200 disabled:opacity-50"
      >
        <Navigation size={15} className={gpsLoading ? 'animate-spin' : ''} />
      </button>

      {/* Search box */}
      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500 pointer-events-none" />
        <input
          ref={inputRef}
          value={query}
          onChange={handleInput}
          onFocus={() => results.length && setOpen(true)}
          placeholder="Search city or district…"
          className="w-56 pl-8 pr-8 py-2 rounded-xl bg-white/[0.05] border border-white/[0.08]
                     text-sm text-stone-300 placeholder-stone-600
                     focus:outline-none focus:border-leaf-600/50 focus:bg-white/[0.07]
                     transition-all duration-200"
        />
        {query && (
          <button onClick={() => { setQuery(''); setResults([]); setOpen(false) }}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-600 hover:text-stone-400">
            <X size={13} />
          </button>
        )}
        {loading && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            <div className="w-3.5 h-3.5 border-2 border-leaf-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Dropdown */}
        {open && results.length > 0 && (
          <div className="absolute top-full left-0 mt-1.5 w-72 rounded-2xl border border-white/[0.08]
                          bg-stone-900/98 backdrop-blur-xl shadow-2xl z-50 overflow-hidden animate-slide-up">
            {results.map((r, i) => (
              <button key={i} onClick={() => pick(r)}
                className="w-full flex items-start gap-2.5 px-4 py-3
                           hover:bg-white/[0.05] transition-colors border-b border-white/[0.04]
                           last:border-0 text-left">
                <MapPin size={14} className="text-leaf-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-stone-200 font-medium">{r.name}</p>
                  <p className="text-2xs text-stone-600">{[r.state, r.country].filter(Boolean).join(', ')}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Click-outside */}
      {open && <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />}
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// 4. CURRENT WEATHER CARD
// ─────────────────────────────────────────────────────────
function CurrentWeatherCard({ current, location, meta }) {
  const isDay    = current.is_day
  const condition = current.condition || {}
  const sev      = condition.severity || 'clear'

  // Background gradient based on condition + time
  const bgMap = {
    clear:  isDay ? 'from-sky-900/60 via-blue-950/80 to-stone-950'    : 'from-indigo-950/70 via-slate-950/80 to-stone-950',
    cloudy: 'from-slate-800/60 via-slate-900/80 to-stone-950',
    fog:    'from-slate-700/50 via-slate-900/80 to-stone-950',
    rain:   'from-blue-900/60 via-slate-900/80 to-stone-950',
    storm:  'from-gray-900/70 via-slate-950/80 to-stone-950',
    snow:   'from-blue-100/10 via-slate-900/80 to-stone-950',
  }
  const bg = bgMap[sev] || bgMap.clear

  return (
    <div className={cn(
      'relative overflow-hidden rounded-3xl border border-white/[0.08] p-6 sm:p-8',
      'bg-gradient-to-br', bg
    )}>
      {/* Atmospheric background animation */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {sev === 'rain' && [...Array(12)].map((_, i) => (
          <div key={i} className="absolute w-px bg-sky-400/20 rounded-full"
            style={{
              left: `${(i/12)*100}%`, top: '-20px', height: '80px',
              animation: `fall ${0.8 + Math.random()*0.8}s linear infinite`,
              animationDelay: `${Math.random()*2}s`
            }} />
        ))}
        {sev === 'storm' && (
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 to-transparent animate-pulse-slow" />
        )}
        {sev === 'clear' && isDay && (
          <div className="absolute -top-8 -right-8 w-48 h-48 rounded-full
                          bg-yellow-400/10 blur-3xl animate-pulse-slow" />
        )}
        {!isDay && (
          <div className="absolute -top-4 -right-4 w-32 h-32 rounded-full
                          bg-indigo-400/8 blur-2xl" />
        )}
      </div>

      <div className="relative z-10 flex flex-col sm:flex-row gap-6 sm:gap-8">

        {/* Left: main temp + icon */}
        <div className="flex items-start gap-5 flex-1">
          <div className="flex-shrink-0 animate-float">
            <WeatherIcon type={condition.icon || 'cloud'} size={80} />
          </div>
          <div>
            <div className="flex items-start gap-1">
              <span className="font-mono text-7xl font-light text-stone-50 leading-none tabular-nums">
                {Math.round(current.temperature_2m)}
              </span>
              <span className="font-mono text-2xl text-stone-400 mt-3">°C</span>
            </div>
            <p className="text-stone-300 text-sm mt-1 font-medium">{condition.label}</p>
            <p className="text-stone-500 text-xs mt-0.5">
              Feels like {Math.round(current.apparent_temperature)}°C
            </p>

            {/* Location */}
            <div className="flex items-center gap-1.5 mt-3">
              <MapPin size={13} className="text-leaf-400 flex-shrink-0" />
              <span className="text-sm text-stone-300 font-medium">
                {location.name}{location.state ? `, ${location.state}` : ''}
              </span>
              {location.country && location.country !== 'India' && (
                <span className="text-xs text-stone-600">{location.country}</span>
              )}
            </div>
            <p className="text-2xs text-stone-700 font-mono mt-0.5">
              {meta?.lat?.toFixed(4)}°N  {meta?.lon?.toFixed(4)}°E
            </p>
          </div>
        </div>

        {/* Right: metric grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 sm:gap-2 content-start">
          {[
            { icon: Droplets,    label: 'Humidity',  value: `${current.relative_humidity_2m}%`,            color: 'text-sky-400'     },
            { icon: Wind,        label: 'Wind',      value: `${Math.round(current.wind_speed_10m)} km/h`,  color: 'text-stone-300'   },
            { icon: Gauge,       label: 'Pressure',  value: `${Math.round(current.pressure_msl)} hPa`,     color: 'text-harvest-400' },
            { icon: Eye,         label: 'Cloud',     value: `${current.cloud_cover}%`,                     color: 'text-slate-400'   },
            { icon: Zap,         label: 'UV Index',  value: `${current.uv_index?.toFixed(1)} · ${current.uv_label?.label || ''}`, color: current.uv_label?.color === 'green' ? 'text-leaf-400' : 'text-harvest-400' },
            { icon: Wind,        label: 'Gust',      value: `${Math.round(current.wind_gusts_10m)} km/h `, color: 'text-stone-400'   },
            { icon: CloudRain,   label: 'Rain (1h)', value: `${current.rain?.toFixed(1) || 0} mm`,         color: 'text-sky-400'     },
            { icon: Navigation,  label: 'Wind Dir',  value: current.wind_direction_compass || '—',         color: 'text-stone-400'   },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label}
              className="flex items-center gap-2.5 bg-black/20 rounded-xl px-3 py-2.5 min-w-[120px]">
              <Icon size={14} className={cn('flex-shrink-0', color)} />
              <div>
                <p className="text-2xs text-stone-600 leading-none mb-0.5">{label}</p>
                <p className="text-xs font-mono text-stone-200 font-medium leading-none">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sunrise / Sunset strip */}
      {/* Shown via daily[0] in parent */}
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// 5. HOURLY STRIP — 24h horizontal scroll
// ─────────────────────────────────────────────────────────
function HourlyStrip({ hourly }) {
  if (!hourly?.length) return null
  const now = new Date().getHours()

  return (
    <div>
      <h3 className="text-xs font-mono text-stone-500 uppercase tracking-widest mb-3">
        24-Hour Forecast
      </h3>
      <div className="overflow-x-auto pb-2 -mx-1">
        <div className="flex gap-2 px-1" style={{ minWidth: 'max-content' }}>
          {hourly.map((h, i) => {
            const hr       = new Date(h.time).getHours()
            const isNow    = hr === now
            return (
              <div key={i}
                className={cn(
                  'flex flex-col items-center gap-2 px-3 py-3 rounded-2xl border',
                  'transition-all duration-200 min-w-[72px]',
                  isNow
                    ? 'bg-leaf-900/70 border-leaf-700/50 shadow-leaf'
                    : 'bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.06]'
                )}>
                <span className="text-2xs font-mono text-stone-500">{isNow ? 'NOW' : h.hour}</span>
                <WeatherIcon type={h.condition?.icon || 'cloud'} size={32} />
                <span className="text-sm font-mono font-medium text-stone-200">{Math.round(h.temp)}°</span>
                {/* Rain chance bar */}
                <div className="w-full">
                  <div className="h-1 bg-white/[0.06] rounded-full overflow-hidden">
                    <div className="h-full bg-sky-500 rounded-full transition-all"
                      style={{ width: `${h.rainChance || 0}%` }} />
                  </div>
                  <p className="text-2xs text-stone-700 text-center mt-0.5 font-mono">
                    {h.rainChance || 0}%
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// 6. DAILY FORECAST — 7-day grid
// ─────────────────────────────────────────────────────────
function DailyForecast({ daily }) {
  const [selected, setSelected] = useState(0)
  if (!daily?.length) return null

  const sel = daily[selected]

  return (
    <div>
      <h3 className="text-xs font-mono text-stone-500 uppercase tracking-widest mb-3">
        7-Day Forecast
      </h3>

      {/* Day selector row */}
      <div className="grid grid-cols-7 gap-1.5 sm:gap-2 mb-4">
        {daily.map((d, i) => (
          <button key={i} onClick={() => setSelected(i)}
            className={cn(
              'flex flex-col items-center gap-1.5 py-3 px-1 rounded-2xl border',
              'transition-all duration-200',
              selected === i
                ? 'bg-leaf-900/60 border-leaf-700/50 shadow-leaf'
                : 'bg-white/[0.03] border-white/[0.05] hover:bg-white/[0.06] hover:border-white/[0.08]'
            )}>
            <span className="text-2xs font-mono text-stone-500">{i === 0 ? 'Today' : d.dayName}</span>
            <WeatherIcon type={d.condition?.icon || 'cloud'} size={28} />
            <div className="flex flex-col items-center gap-0">
              <span className="text-xs font-mono font-medium text-stone-200">{Math.round(d.tempMax)}°</span>
              <span className="text-2xs font-mono text-stone-600">{Math.round(d.tempMin)}°</span>
            </div>
            {/* Rain chance dot */}
            {d.rainChance > 30 && (
              <div className="flex items-center gap-0.5">
                <div className="w-1 h-1 rounded-full bg-sky-400" />
                <span className="text-2xs text-sky-400 font-mono">{d.rainChance}%</span>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Selected day detail */}
      {sel && (
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 grid grid-cols-2 sm:grid-cols-4 gap-4 animate-fade-in">
          <div>
            <p className="text-2xs text-stone-600 mb-1">Date</p>
            <p className="text-sm font-medium text-stone-200">{sel.dateLabel}</p>
            <p className="text-xs text-stone-400 mt-0.5">{sel.condition?.label}</p>
          </div>
          <div>
            <p className="text-2xs text-stone-600 mb-1">Temperature</p>
            <div className="flex items-center gap-2">
              <ArrowUp size={13} className="text-red-400" />
              <span className="font-mono text-stone-200">{Math.round(sel.tempMax)}°</span>
              <ArrowDown size={13} className="text-sky-400" />
              <span className="font-mono text-stone-400">{Math.round(sel.tempMin)}°</span>
            </div>
          </div>
          <div>
            <p className="text-2xs text-stone-600 mb-1">Sunrise / Sunset</p>
            <div className="flex items-center gap-2 text-xs">
              <Sunrise size={13} className="text-harvest-400" />
              <span className="font-mono text-stone-300">
                {sel.sunrise ? new Date(sel.sunrise).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : '—'}
              </span>
              <Sunset size={13} className="text-orange-400" />
              <span className="font-mono text-stone-300">
                {sel.sunset ? new Date(sel.sunset).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : '—'}
              </span>
            </div>
          </div>
          <div>
            <p className="text-2xs text-stone-600 mb-1">Rain / Wind</p>
            <p className="text-xs font-mono text-stone-300">
              {sel.precipSum?.toFixed(1) || 0} mm · {sel.rainChance}% chance
            </p>
            <p className="text-xs font-mono text-stone-500 mt-0.5">
              Wind {Math.round(sel.windMax)} km/h {sel.windDir}
            </p>
          </div>
          <div>
            <p className="text-2xs text-stone-600 mb-1">UV Max</p>
            <p className="text-sm font-mono text-stone-200">{sel.uvMax?.toFixed(1)}</p>
          </div>
          <div>
            <p className="text-2xs text-stone-600 mb-1">Evapotranspiration</p>
            <p className="text-sm font-mono text-stone-200">{sel.evapotranspiration?.toFixed(1)} mm</p>
            <p className="text-2xs text-stone-600">Water demand</p>
          </div>
          <div>
            <p className="text-2xs text-stone-600 mb-1">Wind Gust</p>
            <p className="text-sm font-mono text-stone-200">{Math.round(sel.windGust)} km/h</p>
          </div>
          <div>
            <p className="text-2xs text-stone-600 mb-1">Rain Hours</p>
            <p className="text-sm font-mono text-stone-200">{sel.precipHours || 0} hrs</p>
          </div>
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// 7. SOIL PANEL — agri-specific data
// ─────────────────────────────────────────────────────────
function SoilPanel({ hourly }) {
  if (!hourly?.length) return null
  const now = hourly[0]  // Current hour

  const soilTemp = now?.soilTemp
  const soilMoist = now?.soilMoisture

  // Moisture reading: 0–0.5 m³/m³ typical range
  const moistPct = soilMoist != null ? Math.min(100, Math.round((soilMoist / 0.5) * 100)) : null
  const moistLabel = moistPct == null ? '—' : moistPct < 20 ? 'Very Dry' : moistPct < 40 ? 'Dry' : moistPct < 60 ? 'Optimal' : moistPct < 80 ? 'Moist' : 'Saturated'
  const moistColor = moistPct == null ? 'text-stone-600' : moistPct < 20 ? 'text-red-400' : moistPct < 40 ? 'text-harvest-400' : moistPct < 60 ? 'text-leaf-400' : moistPct < 80 ? 'text-sky-400' : 'text-blue-400'

  // Soil temp assessment
  const soilTempLabel = soilTemp == null ? '—' : soilTemp < 8 ? 'Too Cold' : soilTemp < 15 ? 'Cool' : soilTemp < 25 ? 'Optimal' : soilTemp < 32 ? 'Warm' : 'Very Hot'
  const soilTempColor = soilTemp == null ? 'text-stone-600' : soilTemp < 8 ? 'text-sky-400' : soilTemp < 15 ? 'text-sky-300' : soilTemp < 25 ? 'text-leaf-400' : soilTemp < 32 ? 'text-harvest-400' : 'text-red-400'

  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-5">
      <div className="flex items-center gap-2 mb-4">
        <Leaf size={15} className="text-soil-400 text-harvest-600" />
        <h3 className="text-xs font-mono text-stone-400 uppercase tracking-widest">Soil Conditions</h3>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {/* Soil Temperature */}
        <div>
          <p className="text-2xs text-stone-600 mb-1">Surface Temperature</p>
          <div className="flex items-baseline gap-1.5">
            <span className="font-mono text-3xl text-stone-100">{soilTemp != null ? Math.round(soilTemp) : '—'}</span>
            {soilTemp != null && <span className="font-mono text-stone-500 text-lg">°C</span>}
          </div>
          <span className={cn('text-xs font-medium mt-0.5', soilTempColor)}>{soilTempLabel}</span>
          <div className="mt-2 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-sky-500 via-leaf-500 to-red-500 rounded-full"
              style={{ width: `${Math.min(100, Math.max(0, ((soilTemp || 0) / 40) * 100))}%` }} />
          </div>
          <div className="flex justify-between text-2xs text-stone-700 mt-0.5">
            <span>0°</span><span>20°</span><span>40°</span>
          </div>
        </div>

        {/* Soil Moisture */}
        <div>
          <p className="text-2xs text-stone-600 mb-1">Surface Moisture</p>
          <div className="flex items-baseline gap-1.5">
            <span className="font-mono text-3xl text-stone-100">
              {soilMoist != null ? soilMoist.toFixed(2) : '—'}
            </span>
            {soilMoist != null && <span className="font-mono text-stone-500 text-xs">m³/m³</span>}
          </div>
          <span className={cn('text-xs font-medium', moistColor)}>{moistLabel}</span>
          <div className="mt-2 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
            <div className={cn('h-full rounded-full transition-all', moistColor.replace('text-', 'bg-'))}
              style={{ width: `${moistPct || 0}%` }} />
          </div>
          <div className="flex justify-between text-2xs text-stone-700 mt-0.5">
            <span>Dry</span><span>Optimal</span><span>Sat.</span>
          </div>
        </div>
      </div>

      {/* Irrigation tip */}
      <div className="mt-4 pt-4 border-t border-white/[0.05]">
        <p className="text-2xs text-stone-600 leading-relaxed">
          {moistPct != null && moistPct < 30
            ? '💧 Soil is dry — consider irrigation within 24 hours'
            : moistPct != null && moistPct > 75
            ? '⚠️ Soil is saturated — suspend irrigation, ensure drainage'
            : '✅ Soil moisture is in a favourable range for most crops'}
        </p>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// 8. FARMING ALERTS
// ─────────────────────────────────────────────────────────
function FarmingAlerts({ farming }) {
  if (!farming) return null
  const { alerts = [], tips = [] } = farming
  const all = [...alerts, ...tips]
  if (!all.length) return null

  const styleMap = {
    danger:  { bar: 'bg-red-500',     bg: 'bg-red-950/40',     border: 'border-red-800/40',     icon: 'text-red-400',     label: 'bg-red-500/20 text-red-400'     },
    warning: { bar: 'bg-harvest-500', bg: 'bg-harvest-950/40', border: 'border-harvest-800/40', icon: 'text-harvest-400', label: 'bg-harvest-500/20 text-harvest-400' },
    info:    { bar: 'bg-sky-500',     bg: 'bg-sky-950/30',     border: 'border-sky-800/30',     icon: 'text-sky-400',     label: 'bg-sky-500/20 text-sky-400'     },
    success: { bar: 'bg-leaf-500',    bg: 'bg-leaf-950/40',    border: 'border-leaf-800/40',    icon: 'text-leaf-400',    label: 'bg-leaf-500/20 text-leaf-400'   },
  }

  const icons = {
    thermometer: Thermometer, sun: Activity, snowflake: Activity,
    thunder: Zap, rain: CloudRain, droplets: Droplets,
    wind: Wind, calendar: Activity, leaf: Leaf,
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Leaf size={15} className="text-leaf-400" />
        <h3 className="text-xs font-mono text-stone-400 uppercase tracking-widest">
          Farming Advisories
        </h3>
        <span className="text-2xs font-mono bg-white/[0.05] border border-white/[0.08]
                         text-stone-500 px-2 py-0.5 rounded-full ml-auto">
          {all.length} active
        </span>
      </div>
      <div className="space-y-2">
        {all.map((item, i) => {
          const s   = styleMap[item.type] || styleMap.info
          const Icon = icons[item.icon] || Info
          return (
            <div key={i}
              className={cn(
                'relative flex items-start gap-3 p-4 rounded-2xl border',
                s.bg, s.border,
                'animate-slide-up opacity-0-start'
              )}
              style={{ animationDelay: `${i*80}ms`, animationFillMode: 'forwards' }}
            >
              {/* Severity bar */}
              <div className={cn('absolute left-0 top-3 bottom-3 w-0.5 rounded-r-full', s.bar)} />
              <Icon size={15} className={cn('flex-shrink-0 mt-0.5', s.icon)} />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-stone-200 leading-snug">{item.text}</p>
              </div>
              <span className={cn('text-2xs font-mono px-2 py-0.5 rounded-full flex-shrink-0 capitalize', s.label)}>
                {item.type}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// 9. AIR QUALITY CARD
// ─────────────────────────────────────────────────────────
function AirQualityCard({ airQuality }) {
  if (!airQuality) return null
  const aqi   = airQuality.european_aqi
  const label = aqi == null ? '—' : aqi <= 20 ? 'Good' : aqi <= 40 ? 'Fair' : aqi <= 60 ? 'Moderate' : aqi <= 80 ? 'Poor' : 'Very Poor'
  const color  = aqi == null ? 'stone' : aqi <= 20 ? 'leaf' : aqi <= 40 ? 'sky' : aqi <= 60 ? 'harvest' : 'red'

  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-5">
      <h3 className="text-xs font-mono text-stone-500 uppercase tracking-widest mb-4">Air Quality</h3>
      <div className="flex items-end gap-3 mb-4">
        <span className="font-mono text-4xl text-stone-100">{aqi ?? '—'}</span>
        <span className={cn('text-sm font-medium mb-1', `text-${color}-400`)}>{label}</span>
      </div>
      {/* AQI bar */}
      <div className="h-2 bg-gradient-to-r from-leaf-500 via-harvest-400 to-red-500 rounded-full mb-4 relative">
        {aqi != null && (
          <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full border-2 border-stone-900 shadow-lg"
            style={{ left: `${Math.min(95, (aqi / 100) * 100)}%`, transform: 'translate(-50%, -50%)' }} />
        )}
      </div>
      <div className="grid grid-cols-2 gap-3 text-2xs">
        {[
          { label: 'PM2.5', value: airQuality.pm2_5?.toFixed(1), unit: 'μg/m³' },
          { label: 'PM10',  value: airQuality.pm10?.toFixed(1),  unit: 'μg/m³' },
        ].map(({ label, value, unit }) => (
          <div key={label} className="bg-white/[0.03] rounded-xl p-2.5">
            <p className="text-stone-600">{label}</p>
            <p className="font-mono text-stone-200 text-sm mt-0.5">{value ?? '—'} <span className="text-stone-600">{unit}</span></p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// 10. MAIN PAGE
// ─────────────────────────────────────────────────────────
export default function WeatherPage() {
  const {
    location, weather, loading, refreshing, error,
    gpsLoading, changeLocation, detectGPS, refresh,
  } = useWeather()

  const updatedAt = weather?.meta?.generatedAt
    ? new Date(weather.meta.generatedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    : null

  return (
    <div className="space-y-5 animate-fade-in">

      {/* ── Top bar: title + controls ─────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-2xs font-mono text-leaf-400
                          bg-leaf-950 border border-leaf-800/60 px-3 py-1 rounded-full mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-leaf-400 animate-pulse-slow" />
            LIVE WEATHER — OPEN-METEO API
          </div>
          <h1 className="font-display text-2xl sm:text-3xl text-stone-100">
            Weather Dashboard
          </h1>
          {updatedAt && (
            <p className="text-xs text-stone-600 font-mono mt-0.5">
              Updated {updatedAt}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Refresh */}
          <button onClick={refresh} disabled={refreshing || loading}
            className="p-2 rounded-xl bg-white/[0.05] border border-white/[0.08]
                       text-stone-400 hover:text-stone-200 hover:bg-white/[0.08]
                       transition-all duration-200 disabled:opacity-40">
            <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
          </button>

          {/* Location search */}
          <LocationSearch
            onSelect={changeLocation}
            onGPS={detectGPS}
            gpsLoading={gpsLoading}
          />
        </div>
      </div>

      {/* ── Error state ──────────────────────────────────── */}
      {error && (
        <div className="rounded-2xl border border-red-800/40 bg-red-950/30 px-5 py-4
                        flex items-start gap-3">
          <AlertTriangle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-red-300 font-medium">Weather data unavailable</p>
            <p className="text-xs text-red-500 mt-0.5">{error}</p>
          </div>
          <button onClick={refresh}
            className="ml-auto text-xs text-red-400 hover:text-red-300 underline flex-shrink-0">
            Retry
          </button>
        </div>
      )}

      {/* ── Loading state ─────────────────────────────────── */}
      {loading && <WeatherSkeleton />}

      {/* ── Loaded state ──────────────────────────────────── */}
      {!loading && weather && (
        <div className="space-y-5">

          {/* Current weather hero */}
          <CurrentWeatherCard
            current={weather.current}
            location={location}
            meta={weather.meta}
          />

          {/* Hourly strip */}
          <HourlyStrip hourly={weather.hourly} />

          {/* 7-day forecast */}
          <DailyForecast daily={weather.daily} />

          {/* Bottom 3-col grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {/* Farming alerts — spans 2 cols */}
            <div className="md:col-span-2">
              <FarmingAlerts farming={weather.farming} />
            </div>

            {/* Right col: soil + air quality */}
            <div className="space-y-4">
              <SoilPanel hourly={weather.hourly} />
              <AirQualityCard airQuality={weather.current?.air_quality} />
            </div>
          </div>

          {/* Evapotranspiration / irrigation advisory strip */}
          {weather.daily?.length > 0 && (
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
              <div className="flex items-center gap-2 mb-4">
                <CloudRain size={15} className="text-sky-400" />
                <h3 className="text-xs font-mono text-stone-500 uppercase tracking-widest">
                  7-Day Irrigation Demand (ET₀)
                </h3>
              </div>
              <div className="grid grid-cols-7 gap-1.5">
                {weather.daily.map((d, i) => {
                  const et   = d.evapotranspiration || 0
                  const maxET = 8
                  const pct  = Math.min(100, (et / maxET) * 100)
                  return (
                    <div key={i} className="flex flex-col items-center gap-1.5">
                      <span className="text-2xs text-stone-600 font-mono">{i === 0 ? 'Today' : d.dayName}</span>
                      {/* Bar */}
                      <div className="w-full h-16 bg-white/[0.04] rounded-lg overflow-hidden flex flex-col justify-end">
                        <div
                          className={cn('w-full rounded-t-md transition-all duration-700',
                            et < 3 ? 'bg-leaf-600' : et < 5 ? 'bg-harvest-500' : 'bg-red-500'
                          )}
                          style={{ height: `${pct}%`, transitionDelay: `${i*60}ms` }}
                        />
                      </div>
                      <span className="text-2xs text-stone-500 font-mono">{et.toFixed(1)}</span>
                    </div>
                  )
                })}
              </div>
              <p className="text-2xs text-stone-700 mt-3">
                ET₀ (Reference Evapotranspiration) in mm/day — higher values = more irrigation demand.
                Values above 5 mm/day indicate high water stress risk.
              </p>
            </div>
          )}

          {/* Data attribution */}
          <div className="flex items-center justify-between pt-2">
            <p className="text-2xs text-stone-800 font-mono">
              Weather data: Open-Meteo.com · Air quality: Open-Meteo Air Quality API
            </p>
            <p className="text-2xs text-stone-800 font-mono">
              {weather.meta.lat?.toFixed(2)}°N, {weather.meta.lon?.toFixed(2)}°E
              · {weather.meta.timezone}
            </p>
          </div>
        </div>
      )}

      {/* ── No data yet (initial, no error) ──────────────── */}
      {!loading && !weather && !error && (
        <div className="rounded-3xl border border-white/[0.06] bg-white/[0.02] p-16
                        flex flex-col items-center justify-center text-center">
          <CloudRain size={48} className="text-stone-600 mb-4 animate-float" />
          <h3 className="font-medium text-stone-300 mb-2">No weather data</h3>
          <p className="text-sm text-stone-600 max-w-sm">
            Use the search box to find your location, or click the GPS button to detect it automatically.
          </p>
        </div>
      )}
    </div>
  )
}

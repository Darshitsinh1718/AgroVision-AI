// src/pages/HomePage.jsx
// ═══════════════════════════════════════════════════════════════
// AgroVision AI — Personalized Farmer Dashboard
//
// Data sources (in priority order):
//   1. useAuth() from AuthContext (if AuthContext is wired in App.jsx)
//   2. localStorage: agrovision_user   (set by login/signup)
//   3. localStorage: agrovision_farm_profile (set by settings page)
//   4. Safe defaults so the page never crashes for unauthenticated view
//
// Sections:
//   • Hero greeting — farmerName, farmName, location
//   • Profile completion — progress bar based on filled fields
//   • Farm profile summary cards — crop, soil, area, irrigation, etc.
//   • Quick action feature cards — links to all modules
//   • AI Advisory section — context-aware tips from profile data
//   • Yield bar chart (animated, CSS-only)
//   • Recent activity feed (static / replace with API later)
// ═══════════════════════════════════════════════════════════════
import { useState, useEffect, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Sprout, ScanLine, CloudSun, TrendingUp, BarChart3,
  Settings, AlertTriangle, CheckCircle2, Leaf, Upload,
  ArrowRight, RefreshCw, Zap, Activity, Map,
  User, MapPin, Droplets, Tractor, FlaskConical,
  BadgeIndianRupee, Calendar, AreaChart, ChevronRight,
  ThumbsUp, ShieldCheck, Info, Star,
} from 'lucide-react'
import { cn } from '@/utils/cn'
import { useAuth } from '@/context/AuthContext.jsx'

// ── Safe useAuth hook — works even if AuthContext isn't set up yet ──
function useSafeAuth() {
  try {
    // Try to import AuthContext dynamically — won't crash if missing
    const ctx = require('@/context/AuthContext')
    if (ctx?.useAuth) return ctx.useAuth()
  } catch {
    // AuthContext not wired — fall through to localStorage
  }
  return { user: null, logout: null }
}

// ── Read farmer profile from localStorage ──────────────────────────
function readProfile() {
  try {
    // Primary: agrovision_user set by login/signup
    const userRaw = localStorage.getItem('agrovision_user')
    if (userRaw) {
      const user = JSON.parse(userRaw)
      if (user && typeof user === 'object') return user
    }
    // Fallback: agrovision_farm_profile set by settings page
    const profileRaw = localStorage.getItem('agrovision_farm_profile')
    if (profileRaw) return JSON.parse(profileRaw)
  } catch { /* ignore parse errors */ }
  return null
}

// ── Profile completion calculator ──────────────────────────────────
const PROFILE_FIELDS = [
  { key: 'farmerName',   label: 'Farmer Name'      },
  { key: 'email',        label: 'Email'             },
  { key: 'phone',        label: 'Phone'             },
  { key: 'state',        label: 'State'             },
  { key: 'district',     label: 'District'          },
  { key: 'taluka',       label: 'Taluka'            },
  { key: 'village',      label: 'Village'           },
  { key: 'farmName',     label: 'Farm Name'         },
  { key: 'totalArea',    label: 'Total Area'        },
  { key: 'soilType',     label: 'Soil Type'         },
  { key: 'primaryCrop',  label: 'Primary Crop'      },
  { key: 'irrigationType',label:'Irrigation Type'   },
  { key: 'season',       label: 'Season'            },
  { key: 'nearestMarketYard', label: 'Market Yard'  },
]

function calcCompletion(profile) {
  if (!profile) return { pct: 0, missing: PROFILE_FIELDS.map(f => f.label) }
  const filled  = PROFILE_FIELDS.filter(f => profile[f.key] && String(profile[f.key]).trim() !== '')
  const missing = PROFILE_FIELDS.filter(f => !profile[f.key] || String(profile[f.key]).trim() === '').map(f => f.label)
  const pct     = Math.round((filled.length / PROFILE_FIELDS.length) * 100)
  return { pct, missing: missing.slice(0, 3), filled: filled.length, total: PROFILE_FIELDS.length }
}

// ── Crop-specific advisory messages ────────────────────────────────
const CROP_ADVISORIES = {
  'groundnut':  '🥜 Groundnut season — apply Gypsum 500 kg/ha at pegging stage for better pod filling.',
  'wheat':      '🌾 Wheat care — monitor for Yellow Rust after tillering. Timely Propiconazole spray is key.',
  'cotton':     '☁️ Cotton — watch for sucking pests (whitefly, thrips). Apply yellow sticky traps now.',
  'castor':     '🌿 Castor — apply Boron 0.5 g/L at inflorescence emergence for better capsule set.',
  'soybean':    '🫘 Soybean — Rhizobium inoculation before sowing saves 30 kg/ha nitrogen cost.',
  'maize':      '🌽 Maize — top dress Urea 30 kg/acre at knee-high stage for maximum yield.',
  'bajra':      '🌾 Bajra — excellent drought tolerance. Thin to 15 cm spacing for best yield.',
  'tomato':     '🍅 Tomato — apply Calcium Nitrate 3 g/L to prevent Blossom End Rot.',
  'onion':      '🧅 Onion — stop irrigation 15–20 days before harvest for better curing and shelf life.',
  'rice':       '🌾 Rice — maintain 5 cm standing water till panicle initiation stage.',
  'banana':     '🍌 Banana — high potassium demand. Ensure K fertiliser at bunch development.',
  'sugarcane':  '🎋 Sugarcane — drip + fertigation saves 40% water and boosts yield by 25%.',
  'mustard':    '🌼 Mustard — apply Sulphur 20 kg/ha to significantly improve oil content.',
  'cumin':      '🌿 Cumin (Jeera) — spray Mancozeb + Metalaxyl preventively before rains for Blight control.',
  'sesame':     '🌾 Sesame (Til) — harvest early morning when dew is present to reduce shattering loss.',
  'chickpea':   '🫘 Chickpea — Rhizobium + PSB seed treatment saves fertiliser and improves yield.',
}

const IRRIGATION_ADVISORIES = {
  'drip':       '💧 Drip irrigation detected — ideal for all your crops. Schedule fertigation for maximum efficiency.',
  'sprinkler':  '💦 Sprinkler system — best applied in early morning or late evening to reduce evaporation.',
  'canal':      '🏞️ Canal irrigation — track irrigation turns from local APMC/water authority.',
  'borewell':   '⚡ Borewell — monitor electricity schedule for irrigation planning. Consider drip upgrade.',
  'rainfed':    '🌧️ Rainfed farming — check 7-day weather forecast before field operations.',
  'flood':      '🌊 Flood irrigation — consider ridge-and-furrow to reduce water use by 30%.',
}

// ── Yield chart (animated bar chart, 7-day mock) ───────────────────
const YIELD_DATA = [
  { label:'Mon', pct:60 }, { label:'Tue', pct:45 }, { label:'Wed', pct:75 },
  { label:'Thu', pct:55 }, { label:'Fri', pct:80 }, { label:'Sat', pct:65 }, { label:'Sun', pct:90 },
]

function YieldChart() {
  const [animated, setAnimated] = useState(false)
  useEffect(() => { const t = setTimeout(() => setAnimated(true), 400); return () => clearTimeout(t) }, [])
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-stone-900/60 p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-medium text-stone-200">Weekly Activity</h3>
          <p className="text-2xs text-stone-600 font-mono mt-0.5">AI feature usage this week</p>
        </div>
        <BarChart3 size={16} className="text-stone-600" />
      </div>
      <div className="flex items-end gap-2 h-28">
        {YIELD_DATA.map((d, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
            <div className="w-full bg-white/[0.04] rounded-t-lg overflow-hidden flex flex-col justify-end" style={{ height: '90px' }}>
              <div
                className="w-full rounded-t-md bg-gradient-to-t from-leaf-700 to-leaf-500 transition-all duration-700 ease-out"
                style={{ height: animated ? `${d.pct}%` : '0%', transitionDelay: `${i * 80}ms` }}
              />
            </div>
            <span className="text-2xs text-stone-700 font-mono">{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Tiny skeleton ──────────────────────────────────────────────────
function Skel({ className }) {
  return <div className={cn('rounded-xl bg-white/[0.05] animate-pulse', className)} />
}

// ══════════════════════════════════════════════════════════════════
//  MAIN COMPONENT
// ══════════════════════════════════════════════════════════════════
export default function HomePage() {

  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState(null)
  const [animated, setAnimated] = useState(false)

  // Try AuthContext, then localStorage
  let authUser = null
  
  useEffect(() => {
    // Simulate short load then read profile
    const t = setTimeout(() => {
      const p = readProfile()
      setProfile(p)
      setLoading(false)
      // Trigger entrance animations
      setTimeout(() => setAnimated(true), 100)
    }, 600)
    return () => clearTimeout(t)
  }, [])

  const completion = useMemo(() => calcCompletion(profile), [profile])

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <Skel className="h-40 rounded-3xl" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <Skel key={i} className="h-24 rounded-2xl" />)}
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <Skel key={i} className="h-32 rounded-2xl" />)}
        </div>
      </div>
    )
  }

  // ── Derived values ──────────────────────────────────────────────
  const farmerName     = profile?.farmerName || profile?.name || 'Farmer'
  const farmName       = profile?.farmName   || ''
  const location       = [profile?.village, profile?.taluka, profile?.district, profile?.state].filter(Boolean).join(', ') || 'Location not set'
  const primaryCrop    = profile?.primaryCrop || ''
  const soilType       = profile?.soilType   || ''
  const totalArea      = profile?.totalArea  || ''
  const areaUnit       = profile?.areaUnit   || 'acres'
  const irrigation     = profile?.irrigationType || ''
  const season         = profile?.season     || ''
  const nearestYard    = profile?.nearestMarketYard || ''
  const hour           = new Date().getHours()
  const greeting       = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  // ── Crop advisory ───────────────────────────────────────────────
  const cropKey        = primaryCrop.toLowerCase().replace(/\s+/g, '')
  const cropAdvisory   = Object.entries(CROP_ADVISORIES).find(([k]) => cropKey.includes(k))?.[1] || null
  const irrKey         = irrigation.toLowerCase().replace(/[^a-z]/g, '')
  const irrAdvisory    = Object.entries(IRRIGATION_ADVISORIES).find(([k]) => irrKey.includes(k))?.[1] || null

  // ── Profile summary cards ───────────────────────────────────────
  const PROFILE_CARDS = [
    { icon: Sprout,        label: 'Primary Crop',   value: primaryCrop  || 'Not set', color: 'leaf',    empty: !primaryCrop    },
    { icon: FlaskConical,  label: 'Soil Type',      value: soilType     || 'Not set', color: 'harvest', empty: !soilType       },
    { icon: AreaChart,     label: 'Farm Area',      value: totalArea ? `${totalArea} ${areaUnit}` : 'Not set', color: 'sky', empty: !totalArea },
    { icon: Droplets,      label: 'Irrigation',     value: irrigation   || 'Not set', color: 'sky',     empty: !irrigation     },
    { icon: Calendar,      label: 'Season',         value: season       || 'Not set', color: 'harvest', empty: !season         },
    { icon: BadgeIndianRupee, label: 'Nearest Mandi', value: nearestYard || 'Not set', color: 'leaf',  empty: !nearestYard    },
  ]

  const colorMap = {
    leaf:    { icon: 'text-leaf-400',    bg: 'bg-leaf-950',    border: 'border-leaf-800/30'    },
    harvest: { icon: 'text-harvest-400', bg: 'bg-harvest-950', border: 'border-harvest-800/30' },
    sky:     { icon: 'text-sky-400',     bg: 'bg-sky-950',     border: 'border-sky-800/30'     },
  }

  // ── Quick action feature cards ──────────────────────────────────
  const FEATURES = [
    { title: 'Weather Forecast', desc: '7-day forecast & field alerts',        icon: CloudSun,         to: '/weather',   accent: 'sky',     badge: null        },
    { title: 'Market Prices',    desc: `Mandi rates${nearestYard ? ` · ${nearestYard}` : ''}`, icon: TrendingUp, to: '/market', accent: 'harvest', badge: 'Live'      },
    { title: 'Crop Advisor',     desc: 'AI crop recommendation',               icon: Sprout,           to: '/recommend', accent: 'leaf',    badge: 'AI'        },
    { title: 'Disease Scanner',  desc: 'Upload leaf photo for diagnosis',       icon: ScanLine,         to: '/diagnosis', accent: 'harvest', badge: 'AI'        },
    { title: 'Govt Schemes',     desc: 'Subsidies & eligibility check',         icon: BadgeIndianRupee, to: '/schemes',   accent: 'leaf',    badge: '15+'       },
    { title: 'Analytics',        desc: 'Yield & soil trend analysis',           icon: BarChart3,        to: '/analytics', accent: 'sky',     badge: null        },
  ]

  const accentMap = {
    leaf:    { iconBg: 'bg-leaf-950',    iconColor: 'text-leaf-400',    border: 'hover:border-leaf-700/50',    glow: 'hover:shadow-leaf'    },
    harvest: { iconBg: 'bg-harvest-950', iconColor: 'text-harvest-400', border: 'hover:border-harvest-700/50', glow: 'hover:shadow-harvest' },
    sky:     { iconBg: 'bg-sky-950',     iconColor: 'text-sky-400',     border: 'hover:border-sky-700/40',     glow: ''                     },
  }

  // ── Completion bar color ────────────────────────────────────────
  const compColor = completion.pct >= 80 ? 'bg-leaf-500' : completion.pct >= 50 ? 'bg-harvest-500' : 'bg-red-500'
  const compLabel = completion.pct >= 80 ? 'Great profile!' : completion.pct >= 50 ? 'Almost complete' : 'Profile incomplete'

  return (
    <div className={cn('space-y-6', animated && 'animate-fade-in')}>

      {/* ══════════════════════════════════════════════════════════
          HERO SECTION — Personalized greeting
      ══════════════════════════════════════════════════════════ */}
      <div className="relative overflow-hidden rounded-3xl border border-white/[0.08]
                      bg-gradient-to-br from-leaf-950 via-stone-950 to-stone-900 p-6 sm:p-8">

        {/* Background glows */}
        <div className="absolute -top-12 -right-12 w-52 h-52 rounded-full bg-leaf-600/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-8 -left-8 w-36 h-36 rounded-full bg-harvest-600/8 blur-2xl pointer-events-none" />
        <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-5 hidden lg:block pointer-events-none">
          <Leaf size={120} className="text-leaf-400" />
        </div>

        <div className="relative z-10">
          {/* Live badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full
                          bg-leaf-900/60 border border-leaf-700/40 mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-leaf-400 animate-pulse-slow" />
            <span className="text-xs font-mono text-leaf-400 uppercase tracking-wider">
              AgroVision AI · All systems live
            </span>
          </div>

          {/* Greeting */}
          <h1 className="font-display text-3xl sm:text-4xl text-stone-100 mb-1">
            {greeting}, {farmerName} 👋
          </h1>
          {farmName && (
            <p className="text-leaf-400 font-medium text-sm mb-0.5">{farmName}</p>
          )}
          <div className="flex items-center gap-1.5 text-stone-500 text-sm mb-5">
            <MapPin size={13} className="text-stone-600 flex-shrink-0" />
            <span>{location}</span>
          </div>

          {/* Profile completion bar */}
          <div className="bg-black/20 rounded-2xl px-4 py-3 mb-5 border border-white/[0.05]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono text-stone-400">Farm Profile Completion</span>
              <span className={cn(
                'text-xs font-mono font-bold',
                completion.pct >= 80 ? 'text-leaf-400' : completion.pct >= 50 ? 'text-harvest-400' : 'text-red-400'
              )}>
                {completion.pct}% · {compLabel}
              </span>
            </div>
            <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
              <div
                className={cn('h-full rounded-full transition-all duration-1000 ease-out', compColor)}
                style={{ width: `${completion.pct}%` }}
              />
            </div>
            {completion.missing.length > 0 && (
              <p className="text-2xs text-stone-600 mt-1.5">
                Missing: {completion.missing.join(', ')}{completion.missing.length < 3 ? '' : '…'}
                <Link to="/settings" className="text-leaf-500 hover:text-leaf-400 ml-1.5 transition-colors">
                  Complete →
                </Link>
              </p>
            )}
          </div>

          {/* CTA buttons */}
          <div className="flex flex-wrap gap-3">
            <Link to="/diagnosis"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-leaf-600 hover:bg-leaf-500
                         text-white font-semibold text-sm transition-all duration-200 active:scale-95 shadow-leaf">
              <ScanLine size={16} /> Scan a Crop <ArrowRight size={14} />
            </Link>
            <Link to="/recommend"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl
                         bg-white/[0.06] border border-white/[0.1] text-stone-200
                         text-sm hover:bg-white/[0.1] transition-all duration-200">
              <Zap size={15} /> Get Crop Advice
            </Link>
            <Link to="/weather"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl
                         bg-white/[0.04] border border-white/[0.08] text-stone-400
                         text-sm hover:bg-white/[0.07] transition-all duration-200">
              <CloudSun size={15} /> Weather
            </Link>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          FARM PROFILE SUMMARY CARDS
      ══════════════════════════════════════════════════════════ */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-mono font-bold text-stone-500 uppercase tracking-widest">
            Your Farm Profile
          </h2>
          <Link to="/settings" className="text-2xs text-leaf-500 hover:text-leaf-400 font-mono transition-colors flex items-center gap-1">
            Edit profile <ChevronRight size={11} />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {PROFILE_CARDS.map(({ icon: Icon, label, value, color, empty }) => {
            const c = colorMap[color]
            return (
              <div key={label}
                className={cn(
                  'rounded-2xl border p-4 flex flex-col gap-2.5 transition-all duration-200',
                  empty
                    ? 'border-white/[0.05] bg-stone-900/40 opacity-60'
                    : cn('bg-stone-900/70', c.border)
                )}>
                <div className={cn('w-8 h-8 rounded-xl flex items-center justify-center', empty ? 'bg-white/[0.04]' : c.bg)}>
                  <Icon size={16} className={empty ? 'text-stone-700' : c.icon} />
                </div>
                <div>
                  <p className="text-2xs text-stone-600 font-mono leading-none mb-1">{label}</p>
                  <p className={cn('text-xs font-medium leading-tight capitalize',
                    empty ? 'text-stone-700 italic' : 'text-stone-200'
                  )}>
                    {value}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          AI ADVISORY SECTION — Context-aware tips
      ══════════════════════════════════════════════════════════ */}
      {(cropAdvisory || irrAdvisory || nearestYard || completion.pct < 60) && (
        <div>
          <h2 className="text-xs font-mono font-bold text-stone-500 uppercase tracking-widest mb-3">
            🤖 AI Advisory
          </h2>
          <div className="space-y-2">
            {/* Crop advisory */}
            {cropAdvisory && (
              <div className="flex items-start gap-3 p-4 rounded-2xl border border-leaf-800/30 bg-leaf-950/30 animate-slide-up" style={{ animationFillMode: 'forwards' }}>
                <Sprout size={15} className="text-leaf-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-stone-300 leading-relaxed">{cropAdvisory}</p>
              </div>
            )}
            {/* Irrigation advisory */}
            {irrAdvisory && (
              <div className="flex items-start gap-3 p-4 rounded-2xl border border-sky-800/30 bg-sky-950/30 animate-slide-up" style={{ animationDelay: '80ms', animationFillMode: 'forwards' }}>
                <Droplets size={15} className="text-sky-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-stone-300 leading-relaxed">{irrAdvisory}</p>
              </div>
            )}
            {/* Market yard tip */}
            {nearestYard && (
              <div className="flex items-start gap-3 p-4 rounded-2xl border border-harvest-800/30 bg-harvest-950/30 animate-slide-up" style={{ animationDelay: '160ms', animationFillMode: 'forwards' }}>
                <TrendingUp size={15} className="text-harvest-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-stone-300 leading-snug">
                    Your nearest market yard is <span className="text-harvest-300 font-medium">{nearestYard}</span>.
                    Check today's prices before heading to the mandi.
                  </p>
                  <Link to="/market" className="inline-flex items-center gap-1 text-2xs text-harvest-500 hover:text-harvest-400 mt-1.5 transition-colors">
                    View live prices <ChevronRight size={10} />
                  </Link>
                </div>
              </div>
            )}
            {/* Profile incomplete nudge */}
            {completion.pct < 60 && (
              <div className="flex items-start gap-3 p-4 rounded-2xl border border-stone-700/40 bg-stone-900/60 animate-slide-up" style={{ animationDelay: '240ms', animationFillMode: 'forwards' }}>
                <Info size={15} className="text-stone-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-stone-400">
                    Complete your farm profile to get personalized advisories, accurate crop recommendations, and mandi price alerts.
                  </p>
                  <Link to="/settings" className="inline-flex items-center gap-1 text-2xs text-leaf-500 hover:text-leaf-400 mt-1.5 transition-colors">
                    Complete profile now <ChevronRight size={10} />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
          QUICK ACTION FEATURE CARDS
      ══════════════════════════════════════════════════════════ */}
      <div>
        <h2 className="text-xs font-mono font-bold text-stone-500 uppercase tracking-widest mb-3">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map(({ title, desc, icon: Icon, to, accent, badge }, i) => {
            const a = accentMap[accent]
            return (
              <Link
                key={title}
                to={to}
                className={cn(
                  'group relative flex flex-col gap-4 p-5 rounded-2xl border border-white/[0.06]',
                  'bg-gradient-to-br from-stone-900/70 to-stone-950/90',
                  'transition-all duration-300 hover:-translate-y-1 hover:border-white/[0.1]',
                  a.border, a.glow,
                  'animate-slide-up opacity-0-start'
                )}
                style={{ animationDelay: `${i * 60}ms`, animationFillMode: 'forwards' }}
              >
                {/* Icon + Badge */}
                <div className="flex items-start justify-between">
                  <div className={cn(
                    'w-11 h-11 rounded-xl flex items-center justify-center',
                    'transition-transform duration-300 group-hover:scale-110',
                    a.iconBg
                  )}>
                    <Icon size={22} className={a.iconColor} />
                  </div>
                  {badge && (
                    <span className={cn(
                      'text-2xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border',
                      accent === 'harvest'
                        ? 'bg-harvest-900/60 text-harvest-400 border-harvest-700/40'
                        : accent === 'sky'
                        ? 'bg-sky-900/60 text-sky-400 border-sky-700/40'
                        : 'bg-leaf-900/60 text-leaf-400 border-leaf-700/40'
                    )}>
                      {badge}
                    </span>
                  )}
                </div>
                {/* Content */}
                <div className="flex-1">
                  <h3 className="font-medium text-stone-100 mb-1 group-hover:text-white transition-colors">{title}</h3>
                  <p className="text-sm text-stone-500 leading-relaxed group-hover:text-stone-400 transition-colors">{desc}</p>
                </div>
                {/* Arrow */}
                <div className="flex items-center gap-1 text-xs text-stone-600 group-hover:text-leaf-400 transition-colors">
                  <span>Open</span>
                  <ChevronRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                </div>
                {/* Glow overlay */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-gradient-to-br from-white/[0.02] to-transparent" />
              </Link>
            )
          })}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          BOTTOM ROW — Chart + Activity
      ══════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Activity chart */}
        <div className="lg:col-span-2">
          <YieldChart />
        </div>

        {/* Recent activity */}
        <div className="rounded-2xl border border-white/[0.07] bg-stone-900/60 p-5 flex flex-col">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-medium text-stone-200">Recent Activity</h3>
          </div>
          <p className="text-2xs text-stone-600 font-mono mb-4">Your last 5 actions</p>
          <div className="flex-1 space-y-3 overflow-y-auto">
            {[
              { icon: ScanLine, color: 'text-red-400', bg: 'bg-red-950', text: 'Disease scan completed', sub: 'Tomato · Early Blight detected', time: '2m' },
              { icon: Sprout,   color: 'text-leaf-400', bg: 'bg-leaf-950', text: 'Crop recommendation', sub: `${primaryCrop || 'Wheat'} recommended`, time: '18m' },
              { icon: CloudSun, color: 'text-sky-400', bg: 'bg-sky-950', text: 'Weather checked', sub: 'Rain alert: Thu–Fri', time: '1h' },
              { icon: TrendingUp, color: 'text-harvest-400', bg: 'bg-harvest-950', text: 'Market prices viewed', sub: nearestYard || 'Rajkot Mandi', time: '3h' },
              { icon: Settings, color: 'text-stone-400', bg: 'bg-stone-800', text: 'Profile updated', sub: 'Farm details saved', time: '1d' },
            ].map(({ icon: Icon, color, bg, text, sub, time }, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0', bg)}>
                  <Icon size={14} className={color} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-stone-300 truncate">{text}</p>
                  <p className="text-2xs text-stone-600 truncate">{sub}</p>
                </div>
                <span className="text-2xs text-stone-700 font-mono flex-shrink-0">{time} ago</span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}
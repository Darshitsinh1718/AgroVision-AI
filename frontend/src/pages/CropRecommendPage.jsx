// src/pages/CropRecommendPage.jsx
// ═══════════════════════════════════════════════════════════════════
// AI Crop Recommendation Dashboard
// - Soil + weather input form with validation
// - Calls POST /api/v1/recommend
// - Shows TOP recommendation card with confidence meter
// - Shows ALL alternatives with scores (fixes single-output bug)
// - Fertilizer advice, irrigation advice, farming tips
// - Recommendation history from GET /api/v1/recommend
// - Mobile responsive, dark AgroVision theme
// ═══════════════════════════════════════════════════════════════════

import { useState, useEffect, useCallback, useRef } from 'react'
import {
  Sprout, FlaskConical, Thermometer, Droplets,
  CloudRain, Gauge, Leaf, RefreshCw, ChevronDown,
  TrendingUp, ShieldCheck, AlertTriangle, CheckCircle2,
  Info, Clock, Trash2, ChevronRight, Zap, BarChart3,
  ArrowRight, Star, MapPin, Calendar,
} from 'lucide-react'
import { cn } from '@/utils/cn'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'

// ── Helpers ────────────────────────────────────────────────────────
const conf2color = (c) =>
  c >= 80 ? 'leaf' : c >= 65 ? 'sky' : c >= 50 ? 'harvest' : 'stone'

const risk2config = {
  'Low':      { text: 'text-leaf-400',    bg: 'bg-leaf-950',    label: '🟢 Low Risk'      },
  'Moderate': { text: 'text-harvest-400', bg: 'bg-harvest-950', label: '🟡 Moderate Risk' },
  'High':     { text: 'text-red-400',     bg: 'bg-red-950',     label: '🔴 High Risk'     },
  'Very High':{ text: 'text-red-300',     bg: 'bg-red-950',     label: '🚨 Very High Risk' },
}

function Skel({ className }) {
  return <div className={cn('rounded-xl bg-white/[0.05] animate-pulse', className)} />
}

// ═══════════════════════════════════════════════════════════════════
// CONFIDENCE BAR
// ═══════════════════════════════════════════════════════════════════
function ConfBar({ value, color = 'leaf', showLabel = false }) {
  const [w, setW] = useState(0)
  useEffect(() => { const t = setTimeout(() => setW(value), 120); return () => clearTimeout(t) }, [value])
  const cls = {
    leaf:    'from-leaf-600 to-leaf-400',
    sky:     'from-sky-600 to-sky-400',
    harvest: 'from-harvest-600 to-harvest-400',
    stone:   'from-stone-600 to-stone-400',
  }[color] || 'from-leaf-600 to-leaf-400'

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-white/[0.06] rounded-full overflow-hidden">
        <div
          className={cn('h-full rounded-full bg-gradient-to-r transition-all duration-700 ease-out', cls)}
          style={{ width: `${w}%` }}
        />
      </div>
      {showLabel && (
        <span className={cn('text-xs font-mono font-bold w-10 text-right', `text-${color}-400`)}>{value}%</span>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// INPUT FIELD
// ═══════════════════════════════════════════════════════════════════
function InputField({ label, name, value, onChange, unit, icon: Icon, min, max, step = 'any', hint, error }) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-xs font-mono font-medium text-stone-500 uppercase tracking-wider mb-1.5">
        {Icon && <Icon size={12} className="text-leaf-500" />}
        {label}
        {unit && <span className="text-stone-700 normal-case">({unit})</span>}
      </label>
      <input
        type="number"
        name={name}
        value={value}
        onChange={e => onChange(name, e.target.value)}
        min={min}
        max={max}
        step={step}
        placeholder={hint || `${min}–${max}`}
        className={cn(
          'w-full px-3 py-2.5 rounded-xl font-mono text-sm text-stone-200',
          'bg-white/[0.04] border transition-all duration-200',
          'placeholder-stone-700 focus:outline-none focus:bg-white/[0.06]',
          error
            ? 'border-red-700/60 focus:border-red-600'
            : 'border-white/[0.08] focus:border-leaf-600/50'
        )}
      />
      {error && <p className="text-2xs text-red-400 mt-1">{error}</p>}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// MAIN RESULT CARD
// ═══════════════════════════════════════════════════════════════════
function MainResultCard({ result }) {
  const { recommendedCrop, emoji, confidence, confidenceLabel, category,
    reasons, warnings, agronomy, yield: yld, market, riskLevel,
    source, mlServiceUsed, fallbackUsed } = result

  const confColor = conf2color(confidence)
  const riskCfg   = risk2config[riskLevel] || risk2config['Moderate']

  return (
    <div className="rounded-2xl border border-leaf-800/40 bg-gradient-to-br from-leaf-950/60 to-stone-950 overflow-hidden animate-slide-up">
      {/* Source badge */}
      <div className="flex items-center justify-between px-5 pt-4 pb-0">
        <span className={cn(
          'inline-flex items-center gap-1.5 text-2xs font-mono px-2.5 py-1 rounded-full border',
          mlServiceUsed
            ? 'bg-leaf-950 text-leaf-400 border-leaf-800/50'
            : 'bg-harvest-950 text-harvest-400 border-harvest-800/50'
        )}>
          <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse-slow" />
          {mlServiceUsed ? 'ML Model' : 'Rule Engine'}
          {fallbackUsed && ' (fallback)'}
        </span>
        <span className={cn('text-2xs font-mono px-2 py-0.5 rounded', riskCfg.bg, riskCfg.text)}>
          {riskCfg.label}
        </span>
      </div>

      <div className="p-5 pt-4">
        {/* Crop name + confidence */}
        <div className="flex items-start gap-4 mb-5">
          <div className="text-5xl leading-none">{emoji}</div>
          <div className="flex-1">
            <p className="text-2xs text-stone-500 font-mono uppercase tracking-wider mb-0.5">{category} • Best Recommendation</p>
            <h2 className="font-display text-2xl text-stone-100">{recommendedCrop}</h2>
            <div className="flex items-center gap-2 mt-2">
              <ConfBar value={confidence} color={confColor} />
              <span className={cn('text-sm font-mono font-bold flex-shrink-0', `text-${confColor}-400`)}>
                {confidence}%
              </span>
              <span className="text-2xs text-stone-600">({confidenceLabel})</span>
            </div>
          </div>
        </div>

        {/* Reasons */}
        {reasons?.length > 0 && (
          <div className="mb-4">
            <p className="text-2xs font-mono text-stone-600 uppercase tracking-wider mb-2">Why this crop</p>
            <div className="space-y-1.5">
              {reasons.map((r, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-stone-300">
                  <CheckCircle2 size={13} className="text-leaf-500 mt-0.5 flex-shrink-0" />
                  {r}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Warnings */}
        {warnings?.length > 0 && (
          <div className="mb-4 p-3 rounded-xl bg-harvest-950/40 border border-harvest-800/30">
            {warnings.map((w, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-harvest-300">
                <AlertTriangle size={12} className="text-harvest-400 mt-0.5 flex-shrink-0" />
                {w}
              </div>
            ))}
          </div>
        )}

        {/* Yield + Market row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
          {[
            { label: 'Yield Range',     value: yld ? `${yld.min}–${yld.max} ${yld.unit}` : '—', icon: BarChart3,  color: 'text-leaf-400'    },
            { label: 'Market Demand',   value: market?.demand           || '—', icon: TrendingUp, color: 'text-sky-400'     },
            { label: 'Price Stability', value: market?.priceStability   || '—', icon: ShieldCheck,color: 'text-harvest-400' },
            { label: 'MSP Supported',   value: market?.mspAvailable ? 'Yes' : 'No', icon: Star,  color: market?.mspAvailable ? 'text-leaf-400' : 'text-stone-600' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white/[0.03] rounded-xl p-3 border border-white/[0.05]">
              <Icon size={12} className={cn('mb-1', color)} />
              <p className="text-2xs text-stone-600 leading-none">{label}</p>
              <p className="text-xs font-mono font-medium text-stone-300 mt-0.5 truncate">{value}</p>
            </div>
          ))}
        </div>

        {/* Agronomy quick view */}
        {agronomy && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {[
              { label: 'Sowing Time', value: agronomy.sowingTime,  icon: Calendar },
              { label: 'Harvest',     value: agronomy.harvestTime, icon: Leaf     },
              { label: 'Water Needs', value: agronomy.waterNeeds,  icon: Droplets },
            ].filter(x => x.value).map(({ label, value, icon: Icon }) => (
              <div key={label} className="flex items-start gap-2 text-stone-400">
                <Icon size={12} className="text-leaf-600 mt-0.5 flex-shrink-0" />
                <span><span className="text-stone-600">{label}: </span>{value}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// ALTERNATIVES GRID — shows ALL ranked crops, not just top-1
// ═══════════════════════════════════════════════════════════════════
function AlternativesGrid({ alternatives, allRanked }) {
  const [showAll, setShowAll] = useState(false)
  const display = showAll ? (allRanked || alternatives) : (alternatives || [])

  if (!display?.length) return null

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-mono font-bold text-stone-400 uppercase tracking-widest">
          {showAll ? 'All Crops Ranked' : 'Alternative Crops'}
        </h3>
        {allRanked?.length > 5 && (
          <button
            onClick={() => setShowAll(s => !s)}
            className="text-2xs text-leaf-500 hover:text-leaf-400 font-mono flex items-center gap-1 transition-colors"
          >
            {showAll ? 'Show less' : `View all ${allRanked.length} crops`}
            <ChevronDown size={11} className={showAll ? 'rotate-180 transition-transform' : 'transition-transform'} />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {display.map((alt, i) => {
          const color = conf2color(alt.confidence)
          const rCfg  = risk2config[alt.riskLevel] || {}
          return (
            <div key={alt.cropKey || i}
              className="rounded-xl border border-white/[0.07] bg-stone-900/50 p-3.5 hover:border-white/[0.12] transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{alt.emoji}</span>
                  <div>
                    <p className="text-sm font-medium text-stone-200 leading-none">{alt.name}</p>
                    <p className="text-2xs text-stone-600 mt-0.5">{alt.category}</p>
                  </div>
                </div>
                <span className={cn('text-xs font-mono font-bold', `text-${color}-400`)}>{alt.confidence}%</span>
              </div>
              <ConfBar value={alt.confidence} color={color} />
              {alt.riskLevel && (
                <span className={cn('inline-block mt-2 text-2xs font-mono px-1.5 py-0.5 rounded', rCfg.bg, rCfg.text)}>
                  {alt.riskLevel} risk
                </span>
              )}
              {alt.reasons?.length > 0 && (
                <p className="text-2xs text-stone-600 mt-1.5 line-clamp-2">{alt.reasons[0]}</p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// ADVICE PANELS — Fertilizer & Irrigation
// ═══════════════════════════════════════════════════════════════════
function AdvicePanel({ result }) {
  const { agronomy, fertilizerAdvice, irrigationAdvice } = result

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Fertilizer */}
      <div className="rounded-2xl border border-white/[0.07] bg-stone-900/50 p-5">
        <div className="flex items-center gap-2 mb-4">
          <FlaskConical size={15} className="text-sky-400" />
          <h3 className="text-sm font-medium text-stone-300">Fertilizer Advice</h3>
        </div>
        <div className="space-y-2">
          {fertilizerAdvice?.map((line, i) => (
            <p key={i} className="text-xs text-stone-400 leading-relaxed border-b border-white/[0.04] pb-2 last:border-0 last:pb-0">
              {line}
            </p>
          ))}
          {agronomy?.fertilizerTip && (
            <div className="mt-3 pt-3 border-t border-white/[0.05]">
              <p className="text-2xs text-stone-600 uppercase font-mono tracking-wider mb-1">General recommendation</p>
              <p className="text-xs text-stone-400">{agronomy.fertilizerTip}</p>
            </div>
          )}
          {agronomy?.organicTip && (
            <div className="flex items-start gap-2 text-xs text-leaf-400 mt-2">
              <Leaf size={11} className="mt-0.5 flex-shrink-0" />
              {agronomy.organicTip}
            </div>
          )}
        </div>
      </div>

      {/* Irrigation */}
      <div className="rounded-2xl border border-white/[0.07] bg-stone-900/50 p-5">
        <div className="flex items-center gap-2 mb-4">
          <Droplets size={15} className="text-sky-400" />
          <h3 className="text-sm font-medium text-stone-300">Irrigation Advice</h3>
        </div>
        <div className="space-y-2">
          {irrigationAdvice?.map((line, i) => (
            <p key={i} className="text-xs text-stone-400 leading-relaxed border-b border-white/[0.04] pb-2 last:border-0 last:pb-0">
              {line}
            </p>
          ))}
          {agronomy?.irrigationTip && (
            <div className="mt-3 pt-3 border-t border-white/[0.05]">
              <p className="text-2xs text-stone-600 uppercase font-mono tracking-wider mb-1">Critical stages</p>
              <p className="text-xs text-stone-400">{agronomy.irrigationTip}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// FARMING TIPS
// ═══════════════════════════════════════════════════════════════════
function FarmingTips({ tips }) {
  if (!tips?.length) return null
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-stone-900/50 p-5">
      <div className="flex items-center gap-2 mb-3">
        <Zap size={15} className="text-harvest-400" />
        <h3 className="text-sm font-medium text-stone-300">Farming Tips</h3>
      </div>
      <ul className="space-y-2">
        {tips.map((tip, i) => (
          <li key={i} className="flex items-start gap-2.5 text-xs text-stone-400">
            <span className="text-harvest-500 mt-0.5 flex-shrink-0">›</span>
            {tip}
          </li>
        ))}
      </ul>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// HISTORY PANEL
// ═══════════════════════════════════════════════════════════════════
function HistoryPanel({ onReload }) {
  const [history, setHistory]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [page,    setPage]      = useState(1)
  const [hasMore, setHasMore]   = useState(false)

  const load = useCallback(async (pg = 1) => {
    setLoading(true)
    try {
      const res  = await fetch(`${API_BASE}/recommend?page=${pg}&limit=6`)
      const json = await res.json()
      if (pg === 1) setHistory(json.data || [])
      else          setHistory(h => [...h, ...(json.data || [])])
      setHasMore((json.meta?.page || 1) < (json.meta?.pages || 1))
    } catch { /* silent */ }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { load(1) }, [load, onReload])

  const del = async (id) => {
    if (!confirm('Delete this recommendation?')) return
    try {
      await fetch(`${API_BASE}/recommend/${id}`, { method: 'DELETE' })
      setHistory(h => h.filter(r => r._id !== id))
    } catch { alert('Delete failed') }
  }

  return (
    <div className="rounded-2xl border border-white/[0.07] bg-stone-900/50 overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <Clock size={14} className="text-stone-500" />
          <span className="text-sm font-medium text-stone-300">Recent Recommendations</span>
        </div>
        <button onClick={() => load(1)} className="p-1.5 rounded-lg text-stone-600 hover:text-stone-300 hover:bg-white/[0.05] transition-all">
          <RefreshCw size={13} />
        </button>
      </div>

      {loading && history.length === 0 ? (
        <div className="p-4 space-y-2">
          {[...Array(3)].map((_, i) => <Skel key={i} className="h-14" />)}
        </div>
      ) : history.length === 0 ? (
        <div className="py-10 text-center">
          <Sprout size={28} className="text-stone-700 mx-auto mb-2" />
          <p className="text-sm text-stone-600">No recommendations yet</p>
        </div>
      ) : (
        <div className="divide-y divide-white/[0.04]">
          {history.map(rec => {
            const color = conf2color(rec.confidence || 0)
            return (
              <div key={rec._id} className="flex items-center gap-3 px-5 py-3 hover:bg-white/[0.02] transition-colors">
                <span className="text-xl flex-shrink-0">{rec.emoji || '🌿'}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-stone-300 truncate">{rec.recommendedCrop}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={cn('text-2xs font-mono', `text-${color}-400`)}>{rec.confidence}%</span>
                    {rec.context?.season && <span className="text-2xs text-stone-700">· {rec.context.season}</span>}
                    {rec.riskLevel     && <span className="text-2xs text-stone-700">· {rec.riskLevel} risk</span>}
                  </div>
                </div>
                <p className="text-2xs text-stone-700 font-mono flex-shrink-0">
                  {new Date(rec.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short' })}
                </p>
                <button onClick={() => del(rec._id)}
                  className="p-1.5 rounded-lg text-stone-700 hover:text-red-400 hover:bg-red-950/30 transition-all flex-shrink-0">
                  <Trash2 size={13} />
                </button>
              </div>
            )
          })}
        </div>
      )}

      {hasMore && (
        <div className="px-5 py-2.5 border-t border-white/[0.05]">
          <button onClick={() => { const next = page + 1; setPage(next); load(next) }}
            className="w-full text-xs text-stone-600 hover:text-stone-400 flex items-center justify-center gap-1 transition-colors">
            Load more <ChevronDown size={11} />
          </button>
        </div>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════
const SEASONS = [
  { value: '',           label: '— Select season —' },
  { value: 'kharif',    label: 'Kharif (Jun–Nov) 🌧️' },
  { value: 'rabi',      label: 'Rabi (Oct–Apr) ❄️'  },
  { value: 'zaid',      label: 'Zaid (Feb–Jun) ☀️'  },
  { value: 'year-round',label: 'Year-Round 📅'       },
]

const SOIL_TYPES = [
  { value: '',           label: '— Select soil type —' },
  { value: 'alluvial',   label: 'Alluvial (Domat)'     },
  { value: 'black',      label: 'Black Cotton'          },
  { value: 'red',        label: 'Red Laterite'          },
  { value: 'sandy',      label: 'Sandy (Baluee)'        },
  { value: 'sandy-loam', label: 'Sandy Loam'            },
  { value: 'loamy',      label: 'Loamy (Damat)'         },
  { value: 'clay',       label: 'Clay (Chiknee)'        },
  { value: 'clay-loam',  label: 'Clay Loam'             },
  { value: 'laterite',   label: 'Laterite'              },
]

const DEFAULTS = {
  nitrogen: '', phosphorus: '', potassium: '',
  temperature: '', humidity: '', ph: '', rainfall: '',
  state: '', district: '', season: '', soilType: '', fieldName: '',
}

const FIELD_META = [
  { name:'nitrogen',    label:'Nitrogen (N)',    unit:'kg/ha', icon:FlaskConical, min:0,   max:500,  hint:'e.g. 90'  },
  { name:'phosphorus',  label:'Phosphorus (P)',  unit:'kg/ha', icon:FlaskConical, min:0,   max:500,  hint:'e.g. 42'  },
  { name:'potassium',   label:'Potassium (K)',   unit:'kg/ha', icon:FlaskConical, min:0,   max:500,  hint:'e.g. 43'  },
  { name:'ph',          label:'Soil pH',         unit:'',      icon:Gauge,        min:0,   max:14,   hint:'e.g. 6.5', step:'0.1' },
  { name:'temperature', label:'Temperature',     unit:'°C',    icon:Thermometer,  min:-10, max:60,   hint:'e.g. 22'  },
  { name:'humidity',    label:'Humidity',        unit:'%',     icon:Droplets,     min:0,   max:100,  hint:'e.g. 82'  },
  { name:'rainfall',    label:'Rainfall',        unit:'mm',    icon:CloudRain,    min:0,   max:5000, hint:'e.g. 200' },
]

export default function CropRecommendPage() {
  const [form,      setForm]      = useState(DEFAULTS)
  const [errors,    setErrors]    = useState({})
  const [loading,   setLoading]   = useState(false)
  const [result,    setResult]    = useState(null)
  const [apiError,  setApiError]  = useState(null)
  const [reloadKey, setReloadKey] = useState(0)
  const resultRef = useRef(null)

  const handleChange = (name, value) => {
    setForm(f => ({ ...f, [name]: value }))
    if (errors[name]) setErrors(e => ({ ...e, [name]: '' }))
  }

  const validate = () => {
    const e = {}
    for (const { name, min, max } of FIELD_META) {
      const v = parseFloat(form[name])
      if (form[name] === '' || isNaN(v)) { e[name] = 'Required'; continue }
      if (v < min || v > max) e[name] = `Must be ${min}–${max}`
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    setResult(null)
    setApiError(null)

    try {
      const res  = await fetch(`${API_BASE}/recommend`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(form),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.message || `Server error ${res.status}`)
      setResult(json.data)
      setReloadKey(k => k + 1)
      // Scroll to result
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
    } catch (err) {
      setApiError(err.message || 'Failed to get recommendation. Check your connection.')
    } finally {
      setLoading(false)
    }
  }

  const fillDemo = () => {
    setForm(f => ({
      ...f,
      nitrogen:'90', phosphorus:'42', potassium:'43',
      temperature:'21', humidity:'82', ph:'6.5', rainfall:'202',
      season:'kharif', soilType:'alluvial',
    }))
    setErrors({})
  }

  const reset = () => { setForm(DEFAULTS); setResult(null); setApiError(null); setErrors({}) }

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 text-2xs font-mono text-leaf-400
                        bg-leaf-950 border border-leaf-800/60 px-3 py-1 rounded-full mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-leaf-400 animate-pulse-slow" />
          ML MODEL + RULE ENGINE · 20 CROPS · FULL GUIDANCE
        </div>
        <h1 className="font-display text-2xl sm:text-3xl text-stone-100">
          Crop Advisor
        </h1>
        <p className="text-stone-500 text-sm mt-1.5 max-w-xl">
          Enter your soil and weather data — get a ranked list of best crops with full
          fertilizer advice, irrigation schedule, and farming tips.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* ── LEFT: Form ────────────────────────────────────── */}
        <div className="xl:col-span-1">
          <form onSubmit={handleSubmit} className="rounded-2xl border border-white/[0.07] bg-stone-900/50 p-5 space-y-5">

            {/* Soil params */}
            <div>
              <p className="text-2xs font-mono text-stone-600 uppercase tracking-wider mb-3">
                🧪 Soil Parameters
              </p>
              <div className="grid grid-cols-2 gap-3">
                {FIELD_META.slice(0, 4).map(f => (
                  <InputField key={f.name} {...f} value={form[f.name]}
                    onChange={handleChange} error={errors[f.name]} />
                ))}
              </div>
            </div>

            {/* Weather params */}
            <div>
              <p className="text-2xs font-mono text-stone-600 uppercase tracking-wider mb-3">
                🌡 Weather / Climate
              </p>
              <div className="grid grid-cols-2 gap-3">
                {FIELD_META.slice(4).map(f => (
                  <InputField key={f.name} {...f} value={form[f.name]}
                    onChange={handleChange} error={errors[f.name]} />
                ))}
              </div>
            </div>

            {/* Optional context */}
            <div>
              <p className="text-2xs font-mono text-stone-600 uppercase tracking-wider mb-3">
                📍 Location & Season <span className="text-stone-800">(optional — improves accuracy)</span>
              </p>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-2xs text-stone-600 font-mono uppercase tracking-wider block mb-1.5">State</label>
                    <input value={form.state} onChange={e => handleChange('state', e.target.value)}
                      placeholder="e.g. Gujarat"
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-stone-300 placeholder-stone-700 focus:outline-none focus:border-leaf-600/50 transition-all" />
                  </div>
                  <div>
                    <label className="text-2xs text-stone-600 font-mono uppercase tracking-wider block mb-1.5">District</label>
                    <input value={form.district} onChange={e => handleChange('district', e.target.value)}
                      placeholder="e.g. Junagadh"
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-stone-300 placeholder-stone-700 focus:outline-none focus:border-leaf-600/50 transition-all" />
                  </div>
                </div>

                <div>
                  <label className="text-2xs text-stone-600 font-mono uppercase tracking-wider block mb-1.5">Season</label>
                  <select value={form.season} onChange={e => handleChange('season', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-stone-300 focus:outline-none focus:border-leaf-600/50 transition-all appearance-none cursor-pointer">
                    {SEASONS.map(s => <option key={s.value} value={s.value} className="bg-stone-900">{s.label}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-2xs text-stone-600 font-mono uppercase tracking-wider block mb-1.5">Soil Type</label>
                  <select value={form.soilType} onChange={e => handleChange('soilType', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-stone-300 focus:outline-none focus:border-leaf-600/50 transition-all appearance-none cursor-pointer">
                    {SOIL_TYPES.map(s => <option key={s.value} value={s.value} className="bg-stone-900">{s.label}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-2xs text-stone-600 font-mono uppercase tracking-wider block mb-1.5">Field Name</label>
                  <input value={form.fieldName} onChange={e => handleChange('fieldName', e.target.value)}
                    placeholder="e.g. Field 1"
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-stone-300 placeholder-stone-700 focus:outline-none focus:border-leaf-600/50 transition-all" />
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="space-y-2 pt-1">
              <button type="submit" disabled={loading}
                className="w-full py-3 rounded-xl bg-leaf-600 hover:bg-leaf-500 text-white font-semibold
                           flex items-center justify-center gap-2 transition-all duration-200
                           disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] shadow-leaf">
                {loading ? (
                  <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Analysing…</>
                ) : (
                  <><Sprout size={17} /> Get Recommendation <ArrowRight size={15} /></>
                )}
              </button>
              <div className="flex gap-2">
                <button type="button" onClick={fillDemo}
                  className="flex-1 py-2 rounded-xl bg-white/[0.04] border border-white/[0.07] text-stone-400
                             text-sm hover:bg-white/[0.07] transition-all">
                  Try Demo Values
                </button>
                <button type="button" onClick={reset}
                  className="px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.07] text-stone-500
                             text-sm hover:text-stone-300 hover:bg-white/[0.07] transition-all">
                  <RefreshCw size={14} />
                </button>
              </div>
            </div>

          </form>
        </div>

        {/* ── RIGHT: Results ─────────────────────────────────── */}
        <div className="xl:col-span-2 space-y-5">

          {/* Error */}
          {apiError && (
            <div className="flex items-start gap-3 p-4 rounded-2xl bg-red-950/40 border border-red-800/40 animate-fade-in">
              <AlertTriangle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-red-300 font-medium">Recommendation failed</p>
                <p className="text-xs text-red-500 mt-0.5">{apiError}</p>
              </div>
            </div>
          )}

          {/* Loading skeleton */}
          {loading && (
            <div className="space-y-4 animate-fade-in">
              <Skel className="h-56 rounded-2xl" />
              <div className="grid grid-cols-3 gap-3">
                {[...Array(3)].map((_, i) => <Skel key={i} className="h-28 rounded-xl" />)}
              </div>
              <Skel className="h-32 rounded-2xl" />
            </div>
          )}

          {/* RESULTS */}
          {!loading && result && (
            <div ref={resultRef} className="space-y-5">

              {/* Main recommendation */}
              <MainResultCard result={result} />

              {/* Alternative crops — ALL of them */}
              <AlternativesGrid
                alternatives={result.alternatives}
                allRanked={result.allRanked}
              />

              {/* Advice panels */}
              <AdvicePanel result={result} />

              {/* Farming tips */}
              <FarmingTips tips={result.agronomy?.tips} />

              {/* Meta info strip */}
              <div className="flex flex-wrap items-center gap-3 text-2xs text-stone-700 font-mono pt-1">
                <span>Engine: {result.meta?.modelVersion}</span>
                <span>·</span>
                <span>Crops evaluated: {result.meta?.totalCropsEvaluated}</span>
                <span>·</span>
                <span>Latency: {result.meta?.latencyMs}ms</span>
                {result.meta?.mlEndpoint && <>
                  <span>·</span>
                  <span>ML: {result.meta.mlEndpoint}</span>
                </>}
              </div>
            </div>
          )}

          {/* Empty state */}
          {!loading && !result && !apiError && (
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-14
                            flex flex-col items-center justify-center text-center">
              <Sprout size={40} className="text-stone-700 mb-4 animate-float" />
              <h3 className="font-medium text-stone-400 mb-2">Enter soil & weather data</h3>
              <p className="text-sm text-stone-600 max-w-sm">
                Fill in the form and click "Get Recommendation" to see your best crop options
                with full agronomic guidance.
              </p>
              <button onClick={fillDemo}
                className="mt-5 px-4 py-2 rounded-xl bg-leaf-900/60 border border-leaf-800/50
                           text-leaf-400 text-sm hover:bg-leaf-900 transition-all">
                Try with demo values →
              </button>
            </div>
          )}

          {/* History */}
          <HistoryPanel onReload={reloadKey} />
        </div>
      </div>
    </div>
  )
}
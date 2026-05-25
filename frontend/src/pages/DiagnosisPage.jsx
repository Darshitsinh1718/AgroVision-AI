// frontend/src/pages/DiagnosisPage.jsx
// ─────────────────────────────────────────────────────────
// Complete AI Crop Disease Diagnosis dashboard.
// Aesthetic: precision lab / medical diagnostic terminal —
//   scan-line animations, confidence oscilloscopes,
//   severity alert bands, structured recommendation cards.
//
// Sub-components (all inline for portability):
//   ImageUploader       — drag/drop + camera + file picker
//   ScanAnimation       — full-screen scanning effect
//   DiagnosisResult     — complete result card system
//   TreatmentPanel      — chemical / organic / fertilizer cards
//   PreventionPanel     — prevention checklist
//   HistoryPanel        — recent scans
//   ConfidenceBar       — animated gauge
// ─────────────────────────────────────────────────────────

import { useState, useRef, useCallback, useEffect } from 'react'
import {
  Upload, Camera, ScanLine, X, CheckCircle2,
  AlertTriangle, AlertOctagon, ShieldCheck,
  Leaf, FlaskConical, Microscope, RefreshCw,
  ChevronDown, ChevronUp, Trash2, Clock,
  Sprout, Info, ArrowRight, Zap, BookOpen,
  Droplets, Wind, ThumbsUp, Eye,
} from 'lucide-react'
import { cn } from '../utils/cn.js'
import {
  runDiagnosis, getScanHistory, deleteScan,
  SEVERITY_CONFIG, TREATMENT_ICONS,
} from '../services/diagnosisApi.js'

// ── Supported crops (kept in sync with backend knowledge base) ──
const SUPPORTED_CROPS = [
  '', 'Tomato', 'Potato', 'Corn (Maize)', 'Wheat', 'Rice',
  'Grape', 'Cotton', 'Apple', 'Cherry', 'Peach',
  'Pepper', 'Strawberry', 'Soybean',
]

// ─────────────────────────────────────────────────────────
// CONFIDENCE BAR — animated progress gauge
// ─────────────────────────────────────────────────────────
function ConfidenceBar({ value, label, color = 'leaf' }) {
  const [animated, setAnimated] = useState(false)
  useEffect(() => { const t = setTimeout(() => setAnimated(true), 100); return () => clearTimeout(t) }, [])

  const colorMap = {
    leaf: 'from-leaf-600 to-leaf-400', harvest: 'from-harvest-600 to-harvest-400',
    red: 'from-red-700 to-red-400', sky: 'from-sky-600 to-sky-400',
  }

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-stone-400 font-mono">{label}</span>
        <span className={cn('font-mono font-bold tabular-nums', `text-${color}-400`)}>{value}%</span>
      </div>
      <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
        <div
          className={cn('h-full rounded-full bg-gradient-to-r transition-all duration-1000 ease-spring', colorMap[color] || colorMap.leaf)}
          style={{ width: animated ? `${value}%` : '0%' }}
        />
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// SCAN ANIMATION — full overlay while AI processes
// ─────────────────────────────────────────────────────────
function ScanAnimation({ imagePreview, progress, stage }) {
  const stages = [
    'Preprocessing image…',
    'Running PlantVillage model…',
    'Analysing disease markers…',
    'Matching knowledge base…',
    'Generating recommendations…',
    'Finalising diagnosis…',
  ]

  return (
    <div className="relative rounded-2xl overflow-hidden border border-leaf-700/40
                    bg-slate-950 flex flex-col items-center justify-center min-h-[460px]">
      {/* Background image (blurred) */}
      {imagePreview && (
        <img src={imagePreview} alt="Scanning"
          className="absolute inset-0 w-full h-full object-cover opacity-15 blur-sm scale-105" />
      )}

      {/* Scan overlay grid */}
      <div className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'linear-gradient(rgba(45,143,49,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(45,143,49,0.5) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Scan line */}
      <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-leaf-400 to-transparent
                      shadow-[0_0_20px_rgba(45,143,49,0.8)]"
        style={{ animation: 'scanLine 2s linear infinite', top: '0%' }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-6 px-8 text-center">
        {/* Animated icon */}
        <div className="relative">
          <div className="w-24 h-24 rounded-full border-2 border-leaf-500/30
                          flex items-center justify-center animate-pulse-slow">
            <div className="w-16 h-16 rounded-full border-2 border-leaf-500/50
                            flex items-center justify-center">
              <Microscope size={32} className="text-leaf-400" />
            </div>
          </div>
          {/* Orbiting dot */}
          <div className="absolute inset-0 animate-spin" style={{ animationDuration: '3s' }}>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 w-2 h-2
                            rounded-full bg-leaf-400 shadow-[0_0_8px_rgba(45,143,49,1)]" />
          </div>
        </div>

        <div>
          <p className="font-mono text-leaf-400 text-sm font-bold tracking-widest uppercase mb-1">
            AI SCANNING
          </p>
          <p className="text-stone-400 text-sm">
            {stages[Math.min(Math.floor(progress / 17), stages.length - 1)]}
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-64">
          <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-leaf-600 to-leaf-400 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-2xs text-stone-700 mt-1 font-mono">
            <span>INIT</span>
            <span className="text-leaf-500">{progress}%</span>
            <span>DONE</span>
          </div>
        </div>

        {/* Fake terminal output */}
        <div className="text-left bg-black/40 rounded-xl px-4 py-3 w-72 font-mono text-2xs space-y-1">
          {[
            { line: '> Loading MobileNetV2 model', done: progress > 10 },
            { line: '> Image 224×224 preprocessed', done: progress > 25 },
            { line: '> Running inference pass 1/3', done: progress > 45 },
            { line: '> Confidence threshold check', done: progress > 65 },
            { line: '> Knowledge base lookup', done: progress > 80 },
            { line: '> Building recommendations', done: progress > 95 },
          ].map(({ line, done }, i) => (
            <p key={i} className={done ? 'text-leaf-400' : 'text-stone-700'}>
              {done ? '✓' : '·'} {line}
            </p>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// IMAGE UPLOADER — drag/drop + camera + file picker
// ─────────────────────────────────────────────────────────
function ImageUploader({ onImageSelected, cropType, setCropType }) {
  const [dragOver, setDragOver] = useState(false)
  const [preview,  setPreview]  = useState(null)
  const [file,     setFile]     = useState(null)
  const [camActive, setCamActive] = useState(false)
  const fileRef = useRef()
  const videoRef = useRef()
  const streamRef = useRef()

  const handleFile = useCallback((f) => {
    if (!f) return
    if (!f.type.startsWith('image/')) {
      alert('Please upload an image file (JPG, PNG, or WEBP)')
      return
    }
    if (f.size > 15 * 1024 * 1024) {
      alert('Image too large. Maximum size is 15MB.')
      return
    }
    setFile(f)
    setPreview(URL.createObjectURL(f))
    stopCamera()
  }, [])

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop())
      streamRef.current = null
    }
    setCamActive(false)
  }

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      })
      streamRef.current = stream
      setCamActive(true)
      setTimeout(() => { if (videoRef.current) videoRef.current.srcObject = stream }, 100)
    } catch (err) {
      alert('Camera access denied. Please use file upload instead.')
    }
  }

  const capturePhoto = () => {
    if (!videoRef.current) return
    const canvas = document.createElement('canvas')
    canvas.width  = videoRef.current.videoWidth
    canvas.height = videoRef.current.videoHeight
    canvas.getContext('2d').drawImage(videoRef.current, 0, 0)
    canvas.toBlob(blob => {
      const f = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' })
      handleFile(f)
    }, 'image/jpeg', 0.9)
  }

  const clear = () => {
    setFile(null)
    setPreview(null)
    stopCamera()
    if (fileRef.current) fileRef.current.value = ''
  }

  return (
    <div className="space-y-4">
      {/* Crop type selector */}
      <div>
        <label className="block text-xs font-mono text-stone-500 uppercase tracking-wider mb-2">
          Crop Type <span className="text-stone-700">(optional — improves accuracy)</span>
        </label>
        <select
          value={cropType}
          onChange={e => setCropType(e.target.value)}
          className="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08]
                     text-sm text-stone-300 focus:outline-none focus:border-leaf-600/50
                     transition-all duration-200 appearance-none cursor-pointer"
        >
          {SUPPORTED_CROPS.map(c => (
            <option key={c} value={c} className="bg-stone-900">
              {c || '— Select crop (optional) —'}
            </option>
          ))}
        </select>
      </div>

      {/* Camera view */}
      {camActive && (
        <div className="relative rounded-2xl overflow-hidden bg-black border border-white/[0.08]">
          <video ref={videoRef} autoPlay playsInline muted
            className="w-full h-64 object-cover" />
          {/* Crosshair overlay */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-48 h-48 border-2 border-leaf-400/60 rounded-xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4">
              <div className="w-full h-0.5 bg-leaf-400/60 absolute top-1/2" />
              <div className="h-full w-0.5 bg-leaf-400/60 absolute left-1/2" />
            </div>
          </div>
          <div className="absolute bottom-0 inset-x-0 flex gap-3 p-3 bg-gradient-to-t from-black/80">
            <button onClick={capturePhoto}
              className="flex-1 py-2.5 rounded-xl bg-leaf-600 hover:bg-leaf-500
                         text-white font-medium text-sm flex items-center justify-center gap-2
                         transition-all active:scale-95">
              <Camera size={16} /> Capture
            </button>
            <button onClick={stopCamera}
              className="px-4 py-2.5 rounded-xl bg-white/[0.1] text-stone-300 text-sm
                         hover:bg-white/[0.15] transition-all">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Upload zone */}
      {!camActive && (
        <div
          onDragOver={e => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={e => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]) }}
          className={cn(
            'relative rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer',
            'flex flex-col items-center justify-center min-h-64 p-6 text-center',
            dragOver ? 'border-leaf-500 bg-leaf-950/40 scale-[1.01]'
              : preview ? 'border-white/[0.1] bg-black/20'
              : 'border-white/[0.1] hover:border-leaf-700/60 hover:bg-leaf-950/10'
          )}
          onClick={() => !preview && fileRef.current?.click()}
        >
          {preview ? (
            /* Image preview */
            <div className="relative w-full">
              <img src={preview} alt="Crop to diagnose"
                className="max-h-72 w-full object-contain rounded-xl" />
              {/* Scan-line overlay on preview */}
              <div className="absolute inset-0 rounded-xl pointer-events-none"
                style={{
                  background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(45,143,49,0.03) 2px, rgba(45,143,49,0.03) 4px)'
                }}
              />
              <button onClick={e => { e.stopPropagation(); clear() }}
                className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-black/60 backdrop-blur-sm
                           flex items-center justify-center text-stone-400 hover:text-red-400
                           hover:bg-red-950/60 transition-all">
                <X size={14} />
              </button>
              {/* File info */}
              <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm
                              rounded-lg px-2.5 py-1 text-2xs font-mono text-stone-400">
                {file?.name} · {file ? (file.size / 1024).toFixed(0) : 0}KB
              </div>
            </div>
          ) : (
            /* Empty state */
            <>
              {/* Animated scanner icon */}
              <div className="relative mb-4">
                <div className="w-20 h-20 rounded-2xl border border-white/[0.08] bg-white/[0.03]
                                flex items-center justify-center">
                  <ScanLine size={36} className="text-stone-600" />
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-leaf-600
                                flex items-center justify-center animate-pulse-slow">
                  <Zap size={10} className="text-white" />
                </div>
              </div>
              <p className="text-stone-300 font-medium mb-1">Drop your crop photo here</p>
              <p className="text-stone-600 text-sm mb-4">or click to browse files</p>
              <div className="flex flex-wrap gap-2 justify-center mb-2">
                {['JPG', 'PNG', 'WEBP'].map(f => (
                  <span key={f} className="text-2xs font-mono text-stone-700
                                           bg-white/[0.03] border border-white/[0.06]
                                           px-2 py-0.5 rounded">
                    .{f}
                  </span>
                ))}
              </div>
              <p className="text-2xs text-stone-700">Max 15MB · Best: close-up of affected leaf</p>
            </>
          )}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-2">
        <button onClick={() => fileRef.current?.click()}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl
                     bg-white/[0.05] border border-white/[0.08] text-stone-300 text-sm
                     hover:bg-white/[0.08] transition-all duration-200">
          <Upload size={15} /> Browse File
        </button>
        <button onClick={startCamera}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl
                     bg-white/[0.05] border border-white/[0.08] text-stone-300 text-sm
                     hover:bg-white/[0.08] transition-all duration-200">
          <Camera size={15} /> Use Camera
        </button>
      </div>

      <input ref={fileRef} type="file" accept="image/*" className="sr-only"
        onChange={e => handleFile(e.target.files?.[0])} />

      {/* Photo tips */}
      <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-3">
        <p className="text-2xs font-mono text-stone-500 uppercase tracking-wider mb-2">
          📸 Photo tips for best accuracy
        </p>
        <ul className="space-y-1">
          {[
            'Close-up of affected leaf (fill the frame)',
            'Good natural lighting — avoid shadows',
            'Include both healthy and diseased parts',
            'Avoid blurry or dark images',
          ].map((tip, i) => (
            <li key={i} className="flex items-center gap-2 text-2xs text-stone-600">
              <span className="text-leaf-600">›</span> {tip}
            </li>
          ))}
        </ul>
      </div>

      {/* Analyse button */}
      {(file || preview) && (
        <button
          onClick={() => onImageSelected(file || preview)}
          className="w-full py-3.5 rounded-xl bg-leaf-600 hover:bg-leaf-500
                     text-white font-semibold text-sm flex items-center justify-center gap-2
                     transition-all duration-200 active:scale-[0.98] shadow-leaf"
        >
          <Microscope size={18} />
          Analyse with AI
          <ArrowRight size={16} />
        </button>
      )}

      {/* Return the file for programmatic use */}
      <input type="hidden" data-file-ref="true" />
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// SEVERITY BADGE
// ─────────────────────────────────────────────────────────
function SeverityBadge({ severity }) {
  const cfg = SEVERITY_CONFIG[severity] || SEVERITY_CONFIG.moderate
  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider border',
      cfg.bg, cfg.border, cfg.text
    )}>
      {cfg.icon} {cfg.label} SEVERITY
    </span>
  )
}

// ─────────────────────────────────────────────────────────
// DIAGNOSIS RESULT — complete result display
// ─────────────────────────────────────────────────────────
function DiagnosisResult({ result, imagePreview, onReset }) {
  const [expandedSection, setExpandedSection] = useState('treatments')
  const d   = result?.diagnosis?.primaryDiagnosis
  const rec = result?.diagnosis?.recommendations
  const alt = result?.diagnosis?.alternatives || []
  const meta = result?.diagnosis?.meta || {}

  if (!d) return null

  const sev = SEVERITY_CONFIG[d.severity] || SEVERITY_CONFIG.moderate

  const toggle = (s) => setExpandedSection(prev => prev === s ? null : s)

  return (
    <div className="space-y-4 animate-fade-in">

      {/* ── Top: Image + Primary Diagnosis ─────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">

        {/* Image panel */}
        <div className="md:col-span-2 rounded-2xl overflow-hidden border border-white/[0.08]
                        bg-black/30 relative">
          {imagePreview && (
            <img src={imagePreview} alt="Diagnosed crop"
              className="w-full h-full object-cover min-h-48 max-h-72" />
          )}
          {/* Scan grid overlay */}
          <div className="absolute inset-0 pointer-events-none"
            style={{
              background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(45,143,49,0.03) 3px, rgba(45,143,49,0.03) 4px)'
            }}
          />
          {/* Confidence badge */}
          <div className="absolute top-3 right-3">
            <div className={cn(
              'px-3 py-1.5 rounded-xl font-mono font-bold text-sm backdrop-blur-sm border',
              sev.bg, sev.border, sev.text
            )}>
              {d.confidence}% conf.
            </div>
          </div>
        </div>

        {/* Diagnosis card */}
        <div className={cn(
          'md:col-span-3 rounded-2xl p-5 border relative overflow-hidden',
          sev.bg, sev.border
        )}>
          {/* Background pattern */}
          <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
            <Leaf size={128} className={sev.text} />
          </div>

          {d.isHealthy ? (
            <div className="flex items-center gap-3 mb-4">
              <ShieldCheck size={28} className="text-leaf-400 flex-shrink-0" />
              <div>
                <p className="font-display text-2xl text-leaf-300">Plant is Healthy</p>
                <p className="text-xs text-leaf-600 mt-0.5">No disease detected</p>
              </div>
            </div>
          ) : (
            <div className="mb-4">
              <p className="text-2xs font-mono text-stone-600 uppercase tracking-wider mb-1">
                Disease Detected
              </p>
              <p className="font-display text-2xl text-stone-100 leading-tight">{d.disease}</p>
              <p className="text-sm text-stone-400 mt-0.5">{d.crop}</p>
            </div>
          )}

          {/* Severity + confidence */}
          <div className="flex flex-wrap gap-2 mb-4">
            <SeverityBadge severity={d.severity} />
            {meta.isFallbackResult && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-2xs
                               bg-harvest-950 border border-harvest-700/40 text-harvest-400 font-mono">
                ⚠ AI Unavailable — Estimate
              </span>
            )}
          </div>

          {/* Confidence bars */}
          <div className="space-y-2 mb-4">
            <ConfidenceBar
              value={d.confidence}
              label="Primary diagnosis confidence"
              color={d.isHealthy ? 'leaf' : d.severity === 'high' || d.severity === 'critical' ? 'red' : 'harvest'}
            />
            {alt.slice(0, 2).map((a, i) => (
              <ConfidenceBar key={i} value={a.confidence} label={a.label} color="sky" />
            ))}
          </div>

          {/* Pathogen + spread */}
          {d.pathogen && (
            <div className="grid grid-cols-1 gap-2 text-xs">
              <div className="flex items-start gap-2">
                <Microscope size={13} className="text-stone-600 mt-0.5 flex-shrink-0" />
                <span className="text-stone-400 font-mono">{d.pathogen}</span>
              </div>
              {d.spreadMethod && (
                <div className="flex items-start gap-2">
                  <Wind size={13} className="text-stone-600 mt-0.5 flex-shrink-0" />
                  <span className="text-stone-500">{d.spreadMethod}</span>
                </div>
              )}
            </div>
          )}

          {/* Impact metrics */}
          {!d.isHealthy && (
            <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-white/[0.06]">
              <div className="bg-black/20 rounded-xl p-2.5">
                <p className="text-2xs text-stone-600 font-mono">Yield Impact</p>
                <p className="text-sm font-mono font-bold text-harvest-400 mt-0.5">{d.yieldImpact}</p>
              </div>
              <div className="bg-black/20 rounded-xl p-2.5">
                <p className="text-2xs text-stone-600 font-mono">Recovery</p>
                <p className="text-sm font-mono font-bold text-leaf-400 mt-0.5">{d.recoveryTime}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Fallback warning ────────────────────────────── */}
      {meta.processingWarning && (
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-harvest-950/40
                        border border-harvest-700/40">
          <AlertTriangle size={16} className="text-harvest-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-harvest-300">{meta.processingWarning}</p>
        </div>
      )}

      {/* ── Description + Symptoms ──────────────────────── */}
      <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen size={15} className="text-stone-400" />
          <h3 className="text-sm font-medium text-stone-300">About This Condition</h3>
        </div>
        <p className="text-sm text-stone-400 leading-relaxed mb-4">{d.description}</p>
        {d.symptoms?.length > 0 && (
          <>
            <p className="text-xs font-mono text-stone-600 uppercase tracking-wider mb-2">Key Symptoms</p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {d.symptoms.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-stone-400">
                  <Eye size={13} className="text-harvest-500 mt-0.5 flex-shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
          </>
        )}
        {d.affectedParts?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            <span className="text-2xs text-stone-600 font-mono mr-1">Affected:</span>
            {d.affectedParts.map(p => (
              <span key={p} className="text-2xs font-mono px-2 py-0.5 rounded
                                       bg-harvest-950/60 border border-harvest-800/40 text-harvest-500 capitalize">
                {p}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* ── Accordion sections: treatments, fertilizers, organic, prevention ── */}
      {[
        {
          id:    'treatments',
          icon:  FlaskConical,
          label: 'Chemical Treatments',
          color: 'text-sky-400',
          count: rec?.treatments?.length,
          content: rec?.treatments?.length > 0 ? (
            <div className="space-y-3">
              {rec.treatments.map((t, i) => (
                <div key={i} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <p className="text-sm font-medium text-stone-200">{t.name}</p>
                      <span className="inline-flex items-center gap-1 text-2xs font-mono mt-0.5
                                       text-sky-400 bg-sky-950/60 border border-sky-800/40 px-2 py-0.5 rounded capitalize">
                        {TREATMENT_ICONS[t.type] || '💊'} {t.type}
                      </span>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-2xs text-stone-600 font-mono">Dosage</p>
                      <p className="text-xs font-mono font-bold text-stone-300">{t.dosage}</p>
                    </div>
                  </div>
                  {t.frequency && (
                    <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
                      <Clock size={11} className="text-stone-700" />
                      {t.frequency}
                    </div>
                  )}
                  {t.notes && (
                    <p className="text-xs text-stone-600 italic border-t border-white/[0.04] pt-2 mt-2">
                      💡 {t.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : <p className="text-sm text-stone-600">No chemical treatments required.</p>
        },
        {
          id:    'fertilizers',
          icon:  Sprout,
          label: 'Fertilizer Programme',
          color: 'text-harvest-400',
          count: rec?.fertilizers?.length,
          content: rec?.fertilizers?.length > 0 ? (
            <div className="space-y-3">
              {rec.fertilizers.map((f, i) => (
                <div key={i} className="rounded-xl border border-harvest-800/30 bg-harvest-950/20 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-stone-200">{f.name}</p>
                      <p className="text-xs text-stone-500 mt-0.5">{f.purpose}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-2xs text-stone-600 font-mono">Rate</p>
                      <p className="text-xs font-mono font-bold text-harvest-400">{f.dosage}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : <p className="text-sm text-stone-600">No fertilizer applications needed.</p>
        },
        {
          id:    'organic',
          icon:  Leaf,
          label: 'Organic Solutions',
          color: 'text-leaf-400',
          count: rec?.organic?.length,
          content: rec?.organic?.length > 0 ? (
            <div className="space-y-3">
              {rec.organic.map((o, i) => (
                <div key={i} className="rounded-xl border border-leaf-800/30 bg-leaf-950/20 p-4">
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <p className="text-sm font-medium text-stone-200">{o.name}</p>
                    <p className="text-xs font-mono font-bold text-leaf-400 flex-shrink-0">{o.dosage}</p>
                  </div>
                  {o.notes && <p className="text-xs text-stone-500 italic">{o.notes}</p>}
                </div>
              ))}
            </div>
          ) : <p className="text-sm text-stone-600">No organic applications needed.</p>
        },
        {
          id:    'prevention',
          icon:  ShieldCheck,
          label: 'Prevention & Management',
          color: 'text-leaf-400',
          count: rec?.prevention?.length,
          content: rec?.prevention?.length > 0 ? (
            <ul className="space-y-2">
              {rec.prevention.map((p, i) => (
                <li key={i} className="flex items-start gap-3 py-2 border-b border-white/[0.04] last:border-0">
                  <CheckCircle2 size={15} className="text-leaf-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-stone-400">{p}</span>
                </li>
              ))}
            </ul>
          ) : <p className="text-sm text-stone-600">Continue standard good agronomic practice.</p>
        },
      ].map(({ id, icon: Icon, label, color, count, content }) => count > 0 && (
        <div key={id} className="rounded-2xl border border-white/[0.07] overflow-hidden">
          <button
            onClick={() => toggle(id)}
            className="w-full flex items-center justify-between px-5 py-4
                       bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
          >
            <div className="flex items-center gap-3">
              <Icon size={16} className={color} />
              <span className="text-sm font-medium text-stone-300">{label}</span>
              {count > 0 && (
                <span className={cn('text-2xs font-mono px-2 py-0.5 rounded-full border',
                  color.replace('text-', 'bg-').replace('400', '950/50'),
                  color.replace('text-', 'border-').replace('400', '800/40'),
                  color
                )}>{count}</span>
              )}
            </div>
            {expandedSection === id
              ? <ChevronUp size={16} className="text-stone-600" />
              : <ChevronDown size={16} className="text-stone-600" />
            }
          </button>
          {expandedSection === id && (
            <div className="px-5 py-4 border-t border-white/[0.05] animate-fade-in">
              {content}
            </div>
          )}
        </div>
      ))}

      {/* ── Scan again button ────────────────────────────── */}
      <button onClick={onReset}
        className="w-full py-3 rounded-xl border border-white/[0.08] bg-white/[0.03]
                   text-stone-400 hover:text-stone-200 hover:bg-white/[0.06]
                   text-sm flex items-center justify-center gap-2 transition-all">
        <RefreshCw size={15} /> Scan Another Plant
      </button>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// HISTORY PANEL
// ─────────────────────────────────────────────────────────
function HistoryPanel() {
  const [scans,   setScans]   = useState([])
  const [loading, setLoading] = useState(true)
  const [page,    setPage]    = useState(1)
  const [hasMore, setHasMore] = useState(false)

  const loadHistory = useCallback(async (p = 1) => {
    setLoading(true)
    try {
      const res = await getScanHistory({ page: p, limit: 8 })
      if (p === 1) setScans(res.data || [])
      else         setScans(prev => [...prev, ...(res.data || [])])
      setHasMore((res.meta?.page || 1) < (res.meta?.pages || 1))
    } catch { /* silent */ }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { loadHistory(1) }, [loadHistory])

  const handleDelete = async (id) => {
    if (!confirm('Delete this scan?')) return
    try {
      await deleteScan(id)
      setScans(prev => prev.filter(s => s._id !== id))
    } catch (err) { alert(err.message) }
  }

  const sev = (s) => SEVERITY_CONFIG[s] || SEVERITY_CONFIG.moderate

  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <Clock size={14} className="text-stone-500" />
          <span className="text-sm font-medium text-stone-300">Recent Scans</span>
        </div>
        <button onClick={() => loadHistory(1)}
          className="p-1.5 rounded-lg text-stone-600 hover:text-stone-300 hover:bg-white/[0.05] transition-all">
          <RefreshCw size={13} />
        </button>
      </div>

      {loading && scans.length === 0 ? (
        <div className="space-y-2 p-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 rounded-xl bg-white/[0.04] animate-pulse" />
          ))}
        </div>
      ) : scans.length === 0 ? (
        <div className="py-12 text-center">
          <ScanLine size={32} className="text-stone-700 mx-auto mb-3" />
          <p className="text-sm text-stone-600">No scans yet</p>
          <p className="text-xs text-stone-700 mt-0.5">Upload a crop photo to get started</p>
        </div>
      ) : (
        <div className="divide-y divide-white/[0.04]">
          {scans.map(scan => {
            const cfg = sev(scan.advisory?.urgency === 'critical' ? 'critical'
              : scan.advisory?.urgency === 'high' ? 'high'
              : scan.isHealthy ? 'none' : 'moderate')
            return (
              <div key={scan._id}
                className="flex items-start gap-3 px-5 py-3.5 hover:bg-white/[0.02] transition-colors">
                {/* Status dot */}
                <div className={cn('w-2 h-2 rounded-full mt-2 flex-shrink-0', cfg.text.replace('text-', 'bg-'))} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-stone-300 font-medium truncate">
                    {scan.diseaseDetected || 'Unknown'}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-2xs text-stone-600">{scan.cropType}</span>
                    {scan.confidence != null && (
                      <span className="text-2xs font-mono text-stone-700">
                        · {Math.round(scan.confidence * 100)}%
                      </span>
                    )}
                  </div>
                  <p className="text-2xs text-stone-700 font-mono mt-0.5">
                    {scan.createdAt ? new Date(scan.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : ''}
                  </p>
                </div>
                <button onClick={() => handleDelete(scan._id)}
                  className="p-1.5 rounded-lg text-stone-700 hover:text-red-400
                             hover:bg-red-950/30 transition-all flex-shrink-0">
                  <Trash2 size={13} />
                </button>
              </div>
            )
          })}
        </div>
      )}

      {hasMore && (
        <div className="px-5 py-3 border-t border-white/[0.05]">
          <button onClick={() => { const next = page + 1; setPage(next); loadHistory(next) }}
            className="w-full text-xs text-stone-500 hover:text-stone-300 transition-colors
                       flex items-center justify-center gap-1">
            Load more <ChevronDown size={12} />
          </button>
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────
export default function DiagnosisPage() {
  const [cropType,   setCropType]   = useState('')
  const [file,       setFile]       = useState(null)
  const [preview,    setPreview]    = useState(null)
  const [scanning,   setScanning]   = useState(false)
  const [progress,   setProgress]   = useState(0)
  const [result,     setResult]     = useState(null)
  const [error,      setError]      = useState(null)
  const fileRef     = useRef(null)

  // Simulate progress during AI inference
  useEffect(() => {
    if (!scanning) return
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 92) return p  // Hold at 92 until real result
        return p + Math.random() * 4
      })
    }, 600)
    return () => clearInterval(interval)
  }, [scanning])

  const handleImageSelected = useCallback(async (selectedFile) => {
    if (!selectedFile) return
    setFile(selectedFile)
    if (selectedFile instanceof File) {
      setPreview(URL.createObjectURL(selectedFile))
    }
    setResult(null)
    setError(null)
    setScanning(true)
    setProgress(5)

    try {
      const res = await runDiagnosis(
        selectedFile instanceof File ? selectedFile : file,
        cropType,
        '',
        (pct) => setProgress(Math.max(pct, progress))
      )
      setProgress(100)
      await new Promise(r => setTimeout(r, 400)) // brief pause on 100%
      console.log("DIAGNOSIS RESPONSE:", res)
      
      setResult(res.data || res)
    } catch (err) {
      setError(err.message || 'Diagnosis failed. Please try again.')
    } finally {
      setScanning(false)
    }
  }, [cropType, file, progress])

  const reset = () => {
    setFile(null)
    setPreview(null)
    setResult(null)
    setError(null)
    setScanning(false)
    setProgress(0)
    setCropType('')
    if (fileRef.current) fileRef.current.value = ''
  }

  return (
    <div className="space-y-6 animate-fade-in">

      {/* ── Page header ──────────────────────────────────── */}
      <div>
        <div className="inline-flex items-center gap-2 text-2xs font-mono text-harvest-400
                        bg-harvest-950 border border-harvest-800/60 px-3 py-1 rounded-full mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-harvest-400 animate-pulse-slow" />
          CNN MODEL · PLANTVIL LAGE DATASET · 38 DISEASE CLASSES
        </div>
        <h1 className="font-display text-2xl sm:text-3xl text-stone-100">
          AI Disease Scanner
        </h1>
        <p className="text-stone-500 text-sm mt-1.5 max-w-xl">
          Upload a close-up photo of a crop leaf. Our AI model detects diseases across
          14 crops and provides treatment recommendations, fertilizer advice, and prevention tips.
        </p>
      </div>

      {/* ── Main grid ────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Left column: uploader / results */}
        <div className="xl:col-span-2 space-y-5">

          {/* Error state */}
          {error && (
            <div className="flex items-start gap-3 p-4 rounded-2xl bg-red-950/40 border border-red-800/40 animate-fade-in">
              <AlertOctagon size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-red-300 font-medium">Diagnosis failed</p>
                <p className="text-xs text-red-500 mt-0.5">{error}</p>
              </div>
              <button onClick={reset}
                className="text-xs text-red-400 hover:text-red-300 font-medium flex-shrink-0">
                Try again
              </button>
            </div>
          )}

          {/* Scanning animation */}
          {scanning && (
            <ScanAnimation imagePreview={preview} progress={Math.round(progress)} />
          )}

          {/* Upload form — show if no result and not scanning */}
          {!scanning && !result && (
            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5">
              <div className="flex items-center gap-2 mb-5">
                <ScanLine size={16} className="text-harvest-400" />
                <h2 className="text-sm font-medium text-stone-300">Upload Crop Image</h2>
              </div>
              <ImageUploader
                onImageSelected={handleImageSelected}
                cropType={cropType}
                setCropType={setCropType}
              />
            </div>
          )}

          {/* Results */}
          {!scanning && result && (
            <DiagnosisResult
              result={result}
              imagePreview={preview}
              onReset={reset}
            />
          )}
        </div>

        {/* Right column: info + history */}
        <div className="space-y-5">

          {/* Supported crops card */}
          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5">
            <div className="flex items-center gap-2 mb-4">
              <ThumbsUp size={14} className="text-leaf-400" />
              <h3 className="text-sm font-medium text-stone-300">Detection Capability</h3>
            </div>
            <div className="space-y-2 text-xs">
              {[
                { crop: 'Tomato',      diseases: 9,  icon: '🍅' },
                { crop: 'Potato',      diseases: 3,  icon: '🥔' },
                { crop: 'Rice',        diseases: 3,  icon: '🌾' },
                { crop: 'Maize',       diseases: 4,  icon: '🌽' },
                { crop: 'Wheat',       diseases: 3,  icon: '🌿' },
                { crop: 'Cotton',      diseases: 2,  icon: '☁️' },
                { crop: 'Grape',       diseases: 4,  icon: '🍇' },
              ].map(({ crop, diseases, icon }) => (
                <div key={crop}
                  className="flex items-center justify-between py-2
                             border-b border-white/[0.04] last:border-0">
                  <span className="text-stone-400">{icon} {crop}</span>
                  <span className="font-mono text-stone-600 text-2xs">
                    {diseases} conditions
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-white/[0.05]">
              <p className="text-2xs text-stone-700 leading-relaxed">
                Powered by MobileNetV2 fine-tuned on PlantVillage dataset (54,000+ images).
                Free via HuggingFace Inference API.
              </p>
            </div>
          </div>

          {/* Accuracy note */}
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
            <div className="flex items-start gap-2">
              <Info size={14} className="text-sky-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-medium text-stone-300 mb-1">Accuracy Note</p>
                <p className="text-2xs text-stone-600 leading-relaxed">
                  AI confidence above 75% is reliable. 50–74% suggests similar-looking conditions —
                  check alternatives. Below 50% or AI unavailable = rule-based estimate.
                  Always consult a local agronomist for critical decisions.
                </p>
              </div>
            </div>
          </div>

          {/* Scan history */}
          <HistoryPanel />
        </div>
      </div>

      {/* Scan line animation styles */}
      <style>{`
        @keyframes scanLine {
          0%   { top: 0%; opacity: 1; }
          95%  { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  )
}
// backend/src/services/diagnosisService.js
// ─────────────────────────────────────────────────────────
// Crop disease diagnosis using HuggingFace Inference API.
//
// Primary:  HuggingFace plant-disease model (free, no GPU needed)
//           Model: linkanjarad/mobilenet_v2_1.0_224-fine-tuned-plant-disease-detection
//           (Fine-tuned on PlantVillage — 38 classes, 14 crops)
//
// Fallback: Rule-based analysis using image metadata + crop type
//           Returns a useful result even when AI is unavailable.
//
// Pipeline:
//   Image buffer
//     → HuggingFace classification API
//     → Top-5 predictions with confidence
//     → Enrich with disease knowledge base
//     → Return structured diagnosis
// ─────────────────────────────────────────────────────────
 
import { DISEASE_DB, getByLabel, SUPPORTED_CROPS, SEVERITY_RANK } from '../utils/diseaseKnowledgeBase.js'
 
// ── HuggingFace config ────────────────────────────────────
// Free tier: 30,000 inference calls/month. No credit card.
// API Key from: https://huggingface.co/settings/tokens
const HF_API_KEY   = process.env.HF_API_KEY || ''
const HF_MODEL_URL = process.env.HF_MODEL_URL ||
  'https://api-inference.huggingface.co/models/linkanjarad/mobilenet_v2_1.0_224-fine-tuned-plant-disease-detection'
 
// Fallback model (also free, slightly different labels)
const HF_MODEL_URL_FALLBACK =
  'https://api-inference.huggingface.co/models/ozair23/mobilenet_v2_1.0_224-finetuned-plantdisease'
 
const HF_TIMEOUT_MS = parseInt(process.env.HF_TIMEOUT_MS, 10) || 30000
 
// ── Call HuggingFace Inference API ─────────────────────────
async function callHuggingFace(imageBuffer, modelUrl) {
  const headers = { 'Content-Type': 'application/octet-stream' }
  if (HF_API_KEY) headers['Authorization'] = `Bearer ${HF_API_KEY}`
 
  const controller = new AbortController()
  const timer      = setTimeout(() => controller.abort(), HF_TIMEOUT_MS)
 
  try {
    const res = await fetch(modelUrl, {
      method:  'POST',
      headers,
      body:    imageBuffer,
      signal:  controller.signal,
    })
    clearTimeout(timer)
 
    if (!res.ok) {
      const text = await res.text().catch(() => res.statusText)
      throw new Error(`HF API ${res.status}: ${text.slice(0, 200)}`)
    }
 
    const data = await res.json()
    return data // Array of { label, score }
  } catch (err) {
    clearTimeout(timer)
    throw err
  }
}
 
// ── Normalise HuggingFace label to our DB key ─────────────
// HF returns labels like "Tomato Early blight" or "Tomato___Early_blight"
function normLabel(label) {
  // Already in PlantVillage format
  if (label.includes('___')) return label
 
  // "Tomato Early blight" → "Tomato___Early_blight"
  return label.replace(/\s+/g, '_').replace(/_([^_])/, '___$1')
}
 
// ── Rule-based fallback: analyse without AI model ─────────
function ruleFallback(cropType, imageMetaHints) {
  const cropDiseases = Object.entries(DISEASE_DB)
    .filter(([, v]) => cropType
      ? v.crop.toLowerCase() === cropType.toLowerCase()
      : true
    )
 
  if (!cropDiseases.length) {
    // Return generic plant advice
    return [{
      label:      'Unknown',
      score:       0.4,
      db:          null,
      isFallback:  true,
    }]
  }
 
  // Return healthy + 2 common diseases with moderate confidence
  const sorted = cropDiseases.sort((a, b) =>
    SEVERITY_RANK[b[1].severity] - SEVERITY_RANK[a[1].severity]
  )
 
  return sorted.slice(0, 3).map(([key, val], i) => ({
    label:     key,
    score:     i === 0 ? 0.45 : i === 1 ? 0.30 : 0.15,
    db:        { ...val, key },
    isFallback: true,
  }))
}
 
// ── Build enriched prediction object ──────────────────────
function buildPrediction(label, score, dbEntry) {
  const db     = dbEntry || getByLabel(label)
  const pct    = Math.round(score * 100)
 
  return {
    label:        label,
    displayLabel: db ? `${db.crop} — ${db.disease}` : label.replace(/[_]+/g, ' '),
    confidence:   pct,
    confidenceRaw: score,
    isHealthy:    db ? db.disease === 'Healthy' : label.toLowerCase().includes('healthy'),
    crop:         db?.crop  || 'Unknown',
    disease:      db?.disease || label.replace(/[_]+/g, ' '),
    pathogen:     db?.pathogen || null,
    severity:     db?.severity || (pct > 80 ? 'moderate' : 'low'),
    affectedParts: db?.affectedParts || [],
    spreadMethod: db?.spreadMethod || null,
    description:  db?.description || 'No detailed description available for this condition.',
    symptoms:     db?.symptoms || [],
    treatments:   db?.treatments || [],
    fertilizers:  db?.fertilizers || [],
    organic:      db?.organic || [],
    prevention:   db?.prevention || [],
    recoveryTime: db?.recoveryTime || 'Unknown',
    yieldImpact:  db?.yieldImpact || 'Unknown',
  }
}
 
// ── MAIN: diagnose image ───────────────────────────────────
export async function diagnoseImage(imageBuffer, cropTypeHint) {
  let hfResults   = null
  let usedFallback = false
  let modelUsed    = 'HuggingFace PlantDisease MobileNetV2'
  let errors       = []
 
  // ── Step 1: Try primary HF model ─────────────────────
  try {
    hfResults = await callHuggingFace(imageBuffer, HF_MODEL_URL)
  } catch (err) {
    errors.push(`Primary model: ${err.message}`)
 
    // ── Step 2: Try fallback HF model ──────────────────
    try {
      hfResults = await callHuggingFace(imageBuffer, HF_MODEL_URL_FALLBACK)
      modelUsed = 'HuggingFace PlantDisease MobileNetV2 (fallback)'
    } catch (err2) {
      errors.push(`Fallback model: ${err2.message}`)
    }
  }
 
  // ── Step 3: Process HF results ─────────────────────────
  let predictions = []
 
  if (hfResults && Array.isArray(hfResults) && hfResults.length > 0) {
    // Sort by confidence desc, take top 5
    const sorted = [...hfResults]
      .filter(r => r.score != null && r.label)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
 
    predictions = sorted.map(r => {
      const normKey = normLabel(r.label)
      const db      = getByLabel(normKey) || getByLabel(r.label)
      return buildPrediction(normKey, r.score, db)
    })
 
    // Filter by crop hint if provided
    if (cropTypeHint && predictions.length > 0) {
      const matching = predictions.filter(p =>
        p.crop.toLowerCase() === cropTypeHint.toLowerCase()
      )
      if (matching.length > 0) predictions = matching
    }
 
  } else {
    // ── Step 4: Rule-based fallback ────────────────────
    usedFallback = true
    modelUsed    = 'Rule-based fallback (AI unavailable)'
    const fallback = ruleFallback(cropTypeHint, {})
    predictions = fallback.map(f => buildPrediction(f.label, f.score, f.db))
  }
 
  if (!predictions.length) {
    // Absolute fallback
    predictions = [buildPrediction('Unknown', 0.3, null)]
    usedFallback = true
  }
 
  const top = predictions[0]
 
  return {
    // Primary diagnosis
    primaryDiagnosis: {
      label:         top.label,
      displayLabel:  top.displayLabel,
      crop:          top.crop,
      disease:       top.disease,
      confidence:    top.confidence,
      severity:      top.severity,
      isHealthy:     top.isHealthy,
      pathogen:      top.pathogen,
      affectedParts: top.affectedParts,
      spreadMethod:  top.spreadMethod,
      description:   top.description,
      symptoms:      top.symptoms,
      recoveryTime:  top.recoveryTime,
      yieldImpact:   top.yieldImpact,
    },
 
    // Recommendations
    recommendations: {
      treatments:  top.treatments,
      fertilizers: top.fertilizers,
      organic:     top.organic,
      prevention:  top.prevention,
    },
 
    // Alternative predictions
    alternatives: predictions.slice(1).map(p => ({
      label:      p.displayLabel,
      confidence: p.confidence,
      severity:   p.severity,
    })),
 
    // Meta
    meta: {
      modelUsed,
      usedFallback,
      isFallbackResult: usedFallback,
      processingWarning: usedFallback
        ? 'AI model unavailable — results are estimates based on crop type selection. For accurate diagnosis, please ensure a clear close-up photo of the affected leaf.'
        : errors.length > 0
        ? `Used fallback model. Primary: ${errors[0]}`
        : null,
      supportedCrops: SUPPORTED_CROPS,
    },
  }
}
 
export { SUPPORTED_CROPS }
 
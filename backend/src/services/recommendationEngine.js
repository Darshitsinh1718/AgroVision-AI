// backend/src/services/recommendationEngine.js
// ═══════════════════════════════════════════════════════════════════
// Rule-based ML-style crop recommendation engine.
//
// Algorithm: Multi-factor Gaussian scoring
//   For each crop × each input parameter:
//     score = gaussianScore(inputValue, optimalMin, optimalMax, toleranceMin, toleranceMax)
//   Final score = Σ(weight_i × score_i) / Σ(weight_i)
//   Bonus adjustments: season match, soil match, state match
//
// This mirrors what a trained Random Forest would do on the
// PlantVillage/UCI Crop Recommendation dataset — but deterministically,
// with zero external dependencies and full explainability.
//
// Future: swap scoreWithEngine() to call an ML microservice
//         without changing any controller or route code.
// ═══════════════════════════════════════════════════════════════════

import { CROP_DB, CROP_KEYS } from '../utils/cropKnowledgeBase.js'

// ── Parameter weights (importance to recommendation) ────────────────
// Empirically tuned — matches agronomic importance in Indian context
const WEIGHTS = {
  N:        0.15,   // Nitrogen
  P:        0.12,   // Phosphorus
  K:        0.12,   // Potassium
  ph:       0.18,   // pH (critical — wrong pH blocks all nutrients)
  temp:     0.18,   // Temperature (crop physiology)
  humidity: 0.12,   // Humidity
  rainfall: 0.13,   // Rainfall
}

// Bonus weights for categorical matches (added to raw score)
const BONUS = {
  season:   0.12,  // Crop fits the selected season
  soilType: 0.08,  // Crop suits the soil type
  state:    0.05,  // Crop is recommended for the farmer's state
}

// ── Gaussian-style score for a single parameter ─────────────────────
// Returns 1.0 at the center of optimal range,
// decreasing smoothly to 0 at tolerance boundaries.
//
// |=====optimal=====|
// ^                 ^
// optMin          optMax
// |<===tolerance==>|
// tolerMin      tolerMax
function gaussianScore(value, optMin, optMax, tolMin, tolMax) {
  if (value == null || isNaN(value)) return 0.5 // neutral if missing

  // Clamp completely outside tolerance → near zero
  if (value < tolMin || value > tolMax) {
    const dist = value < tolMin ? tolMin - value : value - tolMax
    const range = (tolMax - tolMin) / 2
    return Math.max(0, 0.1 - 0.1 * (dist / (range * 0.5)))
  }

  // Inside optimal range → high score
  if (value >= optMin && value <= optMax) {
    // Scores 1.0 at center, 0.85 at edges of optimal range
    const center = (optMin + optMax) / 2
    const optRange = (optMax - optMin) / 2 || 1
    const distFromCenter = Math.abs(value - center)
    return 1.0 - 0.15 * (distFromCenter / optRange)
  }

  // Between tolerance and optimal → linear interpolation
  if (value < optMin) {
    const range = optMin - tolMin || 1
    return 0.4 + 0.45 * ((value - tolMin) / range)
  } else {
    const range = tolMax - optMax || 1
    return 0.4 + 0.45 * ((tolMax - value) / range)
  }
}

// ── Score a single crop against all inputs ─────────────────────────
function scoreCrop(cropKey, inputs, context) {
  const crop = CROP_DB[cropKey]
  if (!crop) return null

  const { N, P, K, ph, temp, humidity, rainfall } = inputs
  const { season, soilType, state } = context

  // ── Parameter scores ──────────────────────────────────────────────
  const paramScores = {
    N:        gaussianScore(N,        ...crop.optimal.N,        ...crop.tolerance.N),
    P:        gaussianScore(P,        ...crop.optimal.P,        ...crop.tolerance.P),
    K:        gaussianScore(K,        ...crop.optimal.K,        ...crop.tolerance.K),
    ph:       gaussianScore(ph,       ...crop.optimal.ph,       ...crop.tolerance.ph),
    temp:     gaussianScore(temp,     ...crop.optimal.temp,     ...crop.tolerance.temp),
    humidity: gaussianScore(humidity, ...crop.optimal.humidity, ...crop.tolerance.humidity),
    rainfall: gaussianScore(rainfall, ...crop.optimal.rainfall, ...crop.tolerance.rainfall),
  }

  // ── Weighted base score ───────────────────────────────────────────
  let totalWeight = 0
  let weightedSum = 0
  for (const [param, weight] of Object.entries(WEIGHTS)) {
    weightedSum += (paramScores[param] || 0) * weight
    totalWeight += weight
  }
  let baseScore = weightedSum / totalWeight

  // ── Categorical bonuses ───────────────────────────────────────────
  let bonus = 0

  // Season match
  if (season && crop.seasons.includes(season)) {
    bonus += BONUS.season
  } else if (season && season !== '' && !crop.seasons.includes(season)) {
    bonus -= 0.08  // Penalty for wrong season
  }

  // Soil type match
  if (soilType && crop.soilTypes.includes(soilType)) {
    bonus += BONUS.soilType
  }

  // State match
  if (state && crop.states.length > 0 && crop.states.includes(state)) {
    bonus += BONUS.state
  }

  const finalScore = Math.max(0, Math.min(1, baseScore + bonus))

  // ── Build reasons array ───────────────────────────────────────────
  const reasons = []

  // Highlight best matching parameters
  if (paramScores.ph >= 0.85)       reasons.push(`Soil pH ${ph} is ideal for ${crop.name}`)
  if (paramScores.temp >= 0.85)     reasons.push(`Temperature ${temp}°C matches optimal range`)
  if (paramScores.rainfall >= 0.85) reasons.push(`Rainfall ${rainfall} mm suits water requirements`)
  if (paramScores.N >= 0.85)        reasons.push(`Nitrogen level is well-matched`)
  if (season && crop.seasons.includes(season))
    reasons.push(`Excellent fit for ${season.charAt(0).toUpperCase() + season.slice(1)} season`)
  if (soilType && crop.soilTypes.includes(soilType))
    reasons.push(`${soilType.charAt(0).toUpperCase() + soilType.slice(1)} soil is suitable`)
  if (state && crop.states.includes(state))
    reasons.push(`Widely grown in ${state}`)

  // Warn about borderline parameters
  const warnings = []
  if (paramScores.ph < 0.5)       warnings.push(`pH ${ph} may limit yield — optimal: ${crop.optimal.ph[0]}–${crop.optimal.ph[1]}`)
  if (paramScores.temp < 0.5)     warnings.push(`Temperature ${temp}°C is outside comfort zone`)
  if (paramScores.rainfall < 0.5) warnings.push(`Rainfall ${rainfall} mm may need irrigation supplement`)

  return {
    cropKey,
    score:    finalScore,
    confidence: Math.round(finalScore * 100),
    paramScores,
    reasons:  reasons.slice(0, 3),
    warnings,
  }
}

// ── MAIN EXPORT: Run recommendation ───────────────────────────────────
// Returns TOP-1 recommendation + TOP-5 alternatives regardless of score.
// The "single output" bug was caused by a >= 40% filter that dropped all
// alternatives when inputs matched an unusual combination. Fixed below.
export function runRecommendation(inputs, context = {}) {
  const startMs = Date.now()

  // Score ALL crops in the knowledge base
  const scored = CROP_KEYS
    .map(key => scoreCrop(key, inputs, context))
    .filter(Boolean)
    .sort((a, b) => b.score - a.score)

  if (scored.length === 0) {
    return { error: 'No crops could be scored with the given inputs' }
  }

  const top     = scored[0]
  const topCrop = CROP_DB[top.cropKey]

  // Build alternatives: always return up to 5, with NO minimum threshold.
  // Show score so farmer can judge. A crop with 35% confidence is still
  // better information than showing nothing.
  const alternatives = scored
    .slice(1, 6)                  // positions 2–6 in the ranking
    .map(s => ({
      cropKey:    s.cropKey,
      name:       CROP_DB[s.cropKey]?.name     || s.cropKey,
      emoji:      CROP_DB[s.cropKey]?.emoji    || '🌿',
      confidence: s.confidence,
      category:   CROP_DB[s.cropKey]?.category || '',
      riskLevel:  CROP_DB[s.cropKey]?.market?.riskLevel || '',
      reasons:    s.reasons.slice(0, 2),
      warnings:   s.warnings.slice(0, 1),
    }))

  // Determine risk level from market + confidence
  const rawRisk = topCrop.market.riskLevel
  const confidentEnough = top.confidence >= 70
  const riskLevel = !confidentEnough ? 'Moderate'
    : rawRisk === 'Very Low'   ? 'Very Low'
    : rawRisk

  // Build fertilizer advice from inputs vs crop needs
  const fertAdvice = buildFertilizerAdvice(inputs, topCrop)
  const irrigAdvice = buildIrrigationAdvice(inputs, topCrop)

  // Full ranked list — useful for frontend "compare all crops" feature
  const allRanked = scored.map(s => ({
    cropKey:    s.cropKey,
    name:       CROP_DB[s.cropKey]?.name     || s.cropKey,
    emoji:      CROP_DB[s.cropKey]?.emoji    || '🌿',
    confidence: s.confidence,
    category:   CROP_DB[s.cropKey]?.category || '',
    riskLevel:  CROP_DB[s.cropKey]?.market?.riskLevel || '',
  }))

  return {
    // Primary recommendation
    recommendedCrop: topCrop.name,
    cropKey:         top.cropKey,
    emoji:           topCrop.emoji,
    category:        topCrop.category,
    confidence:      top.confidence,
    confidenceLabel: top.confidence >= 85 ? 'Very High'
                   : top.confidence >= 70 ? 'High'
                   : top.confidence >= 55 ? 'Moderate'
                   : 'Low',
    reasons:         top.reasons,
    warnings:        top.warnings,

    // Alternatives
    alternatives,

    // Agronomic guidance
    agronomy: {
      sowingTime:    topCrop.agronomy.sowingTime,
      harvestTime:   topCrop.agronomy.harvestTime,
      waterNeeds:    topCrop.agronomy.waterNeeds,
      fertilizerTip: topCrop.agronomy.fertilizerTip,
      irrigationTip: topCrop.agronomy.irrigationTip,
      organicTip:    topCrop.agronomy.organicTip,
      tips:          topCrop.agronomy.tips,
    },

    // Specific advice based on this farmer's inputs
    fertilizerAdvice: fertAdvice,
    irrigationAdvice: irrigAdvice,

    // Yield & market
    yield:   topCrop.yield,
    market:  topCrop.market,
    riskLevel,

    // Parameter scores for the radar chart (frontend use)
    paramScores: top.paramScores,

    // Metadata
    suitableSeasons: topCrop.seasons,
    allRanked,        // every crop scored — for radar charts, comparison table

    // Metadata
    meta: {
      modelVersion: 'rule-engine-v2.0',
      latencyMs:    Date.now() - startMs,
      totalCropsEvaluated: scored.length,
    },
  }
}

// ── Fertilizer gap analysis ────────────────────────────────────────
function buildFertilizerAdvice(inputs, crop) {
  const { N, P, K } = inputs
  const [optN1, optN2] = crop.optimal.N
  const [optP1, optP2] = crop.optimal.P
  const [optK1, optK2] = crop.optimal.K
  const targetN = (optN1 + optN2) / 2
  const targetP = (optP1 + optP2) / 2
  const targetK = (optK1 + optK2) / 2

  const lines = []

  if (N < optN1) {
    lines.push(`⬆ Nitrogen: Your soil has ${N} kg/ha — add ~${Math.round(targetN - N)} kg/ha N (Urea or DAP)`)
  } else if (N > optN2) {
    lines.push(`⬇ Nitrogen: At ${N} kg/ha, excess N may cause vegetative overgrowth — reduce to ${optN2} kg/ha`)
  } else {
    lines.push(`✅ Nitrogen: ${N} kg/ha is within optimal range`)
  }

  if (P < optP1) {
    lines.push(`⬆ Phosphorus: Add ~${Math.round(targetP - P)} kg/ha P (SSP or DAP as basal dose)`)
  } else {
    lines.push(`✅ Phosphorus: Adequate at ${P} kg/ha`)
  }

  if (K < optK1) {
    lines.push(`⬆ Potassium: Low at ${K} kg/ha — apply ${Math.round(targetK - K)} kg/ha K (MOP/SOP)`)
  } else {
    lines.push(`✅ Potassium: Good level at ${K} kg/ha`)
  }

  return lines
}

// ── Irrigation gap analysis ────────────────────────────────────────
function buildIrrigationAdvice(inputs, crop) {
  const { rainfall, humidity } = inputs
  const [optR1, optR2] = crop.optimal.rainfall
  const targetR = (optR1 + optR2) / 2

  const lines = []

  if (rainfall < optR1) {
    const deficit = Math.round(targetR - rainfall)
    lines.push(`💧 Supplemental irrigation needed: rainfall ${rainfall} mm is below optimal ${optR1}–${optR2} mm. Plan ${deficit} mm irrigation.`)
    lines.push(`Suggested: drip or furrow irrigation at critical crop stages`)
  } else if (rainfall > optR2 * 1.5) {
    lines.push(`🌧 High rainfall area (${rainfall} mm) — ensure good field drainage to prevent waterlogging`)
    lines.push(`Ridge-and-furrow sowing recommended. Avoid basin irrigation.`)
  } else {
    lines.push(`✅ Rainfall ${rainfall} mm is adequate for this crop. Supplemental irrigation only at stress periods.`)
  }

  if (humidity > 80) {
    lines.push(`⚠ High humidity (${humidity}%) increases fungal disease risk — ensure airflow and scout regularly`)
  }

  return lines
}
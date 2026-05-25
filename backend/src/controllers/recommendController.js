// src/controllers/recommendController.js
// ─────────────────────────────────────────────────────────
// Crop recommendation controller — ML-first with rule-engine fallback.
//
// Request flow:
//   POST /api/v1/recommend
//     → validate inputs
//     → call mlCropService.getRecommendation()
//         ↳ tries FastAPI ML model at ML_SERVICE_URL/predict
//         ↳ on any failure: falls back to rule-engine automatically
//     → enrich result (guidance from knowledge base)
//     → save to MongoDB
//     → return result + source indicator
//
// GET    /api/v1/recommend         — paginated history
// GET    /api/v1/recommend/stats   — crop frequency stats
// GET    /api/v1/recommend/:id     — single record
// DELETE /api/v1/recommend/:id     — delete record
// ─────────────────────────────────────────────────────────

import { getRecommendation }  from '../services/mlCropService.js'
import CropRecommendation     from '../models/CropRecommendation.js'
import { ApiResponse }        from '../utils/ApiResponse.js'
import { ApiError }           from '../utils/ApiError.js'
import asyncHandler           from '../utils/asyncHandler.js'
import { parsePagination }    from '../utils/pagination.js'
import logger                 from '../utils/logger.js'

// ── POST /api/v1/recommend ────────────────────────────────
export const getCropRecommendation = asyncHandler(async (req, res) => {
  const {
    nitrogen, phosphorus, potassium,
    temperature, humidity, ph, rainfall,
    state, district, season, soilType, fieldName,
  } = req.body

  // Parse and validate all numeric inputs
  const inputs = {
    N:        parseFloat(nitrogen),
    P:        parseFloat(phosphorus),
    K:        parseFloat(potassium),
    temp:     parseFloat(temperature),
    humidity: parseFloat(humidity),
    ph:       parseFloat(ph),
    rainfall: parseFloat(rainfall),
  }

  const paramLabels = { N:'Nitrogen', P:'Phosphorus', K:'Potassium', temp:'Temperature', humidity:'Humidity', ph:'pH', rainfall:'Rainfall' }
  for (const [k, v] of Object.entries(inputs)) {
    if (isNaN(v) || v === null) {
      throw ApiError.badRequest(`${paramLabels[k] || k} is required and must be a number`)
    }
  }

  const context = {
  state: state || '',
  district: district || '',
  season: season ? season.toLowerCase() : '',
  soilType: soilType || '',
  fieldName: fieldName || '',
}

  // ── Call ML service (with automatic rule-engine fallback) ─────
  const result = await getRecommendation(inputs, context)

  if (result.error) throw ApiError.internal(result.error)

  // ── Persist to MongoDB ────────────────────────────────────────
  let savedId = null
  try {
    const saved = await CropRecommendation.create({
      user:             req.user?.id || undefined,
      inputs: {
        nitrogen:    inputs.N,
        phosphorus:  inputs.P,
        potassium:   inputs.K,
        temperature: inputs.temp,
        humidity:    inputs.humidity,
        ph:          inputs.ph,
        rainfall:    inputs.rainfall,
      },
      context,
      recommendedCrop:  result.recommendedCrop,
      cropKey:          result.cropKey   || null,
      emoji:            result.emoji     || '🌿',
      category:         result.category  || '',
      confidence:       result.confidence,
      confidenceLabel:  result.confidenceLabel,
      riskLevel:        result.riskLevel || '',
      reasons:          result.reasons   || [],
      warnings:         result.warnings  || [],
      alternatives:     result.alternatives || [],
      agronomy:         result.agronomy  || {},
      fertilizerAdvice: result.fertilizerAdvice || [],
      irrigationAdvice: result.irrigationAdvice || [],
      yield:            result.yield     || {},
      market:           result.market    || {},
      modelVersion:     result.meta?.modelVersion  || 'unknown',
      latencyMs:        result.meta?.latencyMs     || 0,
    })
    savedId = saved._id
  } catch (dbErr) {
    // DB failure is non-fatal — user still gets the recommendation
    logger.warn(`Recommend DB save failed (non-fatal): ${dbErr.message}`)
  }

  const usedML  = result.source === 'ml'
  const sourceMsg = usedML ? '(ML model)' : '(rule engine)'

  logger.info(
    `Recommend ${sourceMsg}: ${result.recommendedCrop} ${result.confidence}% — ${result.meta?.latencyMs ?? 0}ms`,
    { userId: req.user?.id || 'anonymous' }
  )

  return ApiResponse.created(res, {
    message: `Recommended: ${result.recommendedCrop} — ${result.confidence}% confidence ${sourceMsg}`,
    data: {
      ...result,
      savedId,
      // Expose source clearly so frontend can show badge
      source:          result.source,          // 'ml' | 'rule-engine'
      mlServiceUsed:   result.meta?.mlServiceUsed ?? false,
      fallbackUsed:    result.source === 'rule-engine',
      fallbackReason:  result.mlError || null,
    },
  })
})

// ── GET /api/v1/recommend ─────────────────────────────────
export const getRecommendationHistory = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query)

  const filter = {}
  if (req.user?.id)     filter.user              = req.user.id
  if (req.query.crop)   filter.recommendedCrop   = { $regex: req.query.crop, $options: 'i' }
  if (req.query.season) filter['context.season'] = req.query.season

  const [docs, total] = await Promise.all([
    CropRecommendation.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('recommendedCrop emoji confidence riskLevel context inputs createdAt alternatives')
      .lean(),
    CropRecommendation.countDocuments(filter),
  ])

  return ApiResponse.paginated(res, docs, total, page, limit, 'Recommendation history')
})

// ── GET /api/v1/recommend/stats ───────────────────────────
export const getRecommendationStats = asyncHandler(async (req, res) => {
  const filter = req.user?.id ? { user: req.user.id } : {}

  const [total, byCrop, recentList] = await Promise.all([
    CropRecommendation.countDocuments(filter),
    CropRecommendation.aggregate([
      { $match:  filter },
      { $group:  { _id: '$recommendedCrop', count: { $sum: 1 }, avgConf: { $avg: '$confidence' }, emoji: { $first: '$emoji' } } },
      { $sort:   { count: -1 } },
      { $limit:  8 },
    ]),
    CropRecommendation.find(filter)
      .sort({ createdAt: -1 })
      .limit(5)
      .select('recommendedCrop emoji confidence createdAt')
      .lean(),
  ])

  return ApiResponse.success(res, {
    data: { total, byCrop, recentList },
  })
})

// ── GET /api/v1/recommend/:id ─────────────────────────────
export const getRecommendationById = asyncHandler(async (req, res) => {
  const filter = { _id: req.params.id }
  if (req.user?.id) filter.user = req.user.id

  const rec = await CropRecommendation.findOne(filter).lean()
  if (!rec) throw ApiError.notFound('Recommendation')

  return ApiResponse.success(res, { data: rec })
})

// ── DELETE /api/v1/recommend/:id ─────────────────────────
export const deleteRecommendation = asyncHandler(async (req, res) => {
  const filter = { _id: req.params.id }
  if (req.user?.id) filter.user = req.user.id

  const rec = await CropRecommendation.findOneAndDelete(filter)
  if (!rec) throw ApiError.notFound('Recommendation')

  return ApiResponse.noContent(res)
})
// backend/src/controllers/diagnosisController.js
// ─────────────────────────────────────────────────────────
// Replace / merge with the existing stub diagnosisController.js
// in agrovision-backend/src/controllers/
//
// Routes:
//   POST   /api/v1/diagnosis          — upload + diagnose
//   GET    /api/v1/diagnosis          — history (paginated)
//   GET    /api/v1/diagnosis/:id      — single scan
//   DELETE /api/v1/diagnosis/:id      — delete scan
//   GET    /api/v1/diagnosis/stats    — statistics
// ─────────────────────────────────────────────────────────
 
import { diagnoseImage, SUPPORTED_CROPS } from '../services/diagnosisService.js'
import CropScan from '../models/CropScan.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { ApiError }    from '../utils/ApiError.js'
import asyncHandler    from '../utils/asyncHandler.js'
import { parsePagination } from '../utils/pagination.js'
import logger          from '../utils/logger.js'
import sharp           from 'sharp'
 
// ── Image preprocessing ───────────────────────────────────
async function preprocessImage(buffer, mimetype) {
  // Validate it's actually an image using sharp
  const meta = await sharp(buffer).metadata()
  if (!meta.width) throw ApiError.badRequest('Uploaded file is not a valid image')
 
  // Resize to 224×224 for the MobileNet model (also reduces payload to HF)
  const processed = await sharp(buffer)
    .resize(224, 224, { fit: 'cover', position: 'centre' })
    .jpeg({ quality: 90 })
    .toBuffer()
 
  return { buffer: processed, meta }
}
 
// ── POST /api/v1/diagnosis ────────────────────────────────
export const scanCrop = asyncHandler(async (req, res) => {
  if (!req.file) throw ApiError.badRequest('Image file is required (field name: "image")')
 
  const { cropType = '', fieldName = '', notes = '' } = req.body
  const startMs = Date.now()
 
  // ── Preprocess image ──────────────────────────────────
  let processedBuffer, imageMeta
  try {
    const result = await preprocessImage(req.file.buffer || require('fs').readFileSync(req.file.path), req.file.mimetype)
    processedBuffer = result.buffer
    imageMeta       = result.meta
  } catch (err) {
    throw ApiError.badRequest(`Image processing failed: ${err.message}`)
  }
 
  // ── Build image URL for response ──────────────────────
  const imageUrl = req.file.path
    ? `/uploads/crops/${require('path').basename(req.file.path)}`
    : null
 
  // ── Create pending record ─────────────────────────────
  const scan = await CropScan.create({
    user:          req.user?.id || null,
    imagePath:     req.file.path || 'memory',
    imageUrl,
    originalName:  req.file.originalname,
    mimeType:      'image/jpeg', // normalised to JPEG by sharp
    fileSizeBytes: processedBuffer.length,
    cropType:      cropType || 'Unknown',
    fieldName:     fieldName || undefined,
    status:        'processing',
  })
 
  // ── Call AI diagnosis service ─────────────────────────
  let diagnosis
  try {
    diagnosis = await diagnoseImage(processedBuffer, cropType || undefined)
  } catch (err) {
    await CropScan.findByIdAndUpdate(scan._id, {
      status:       'failed',
      errorMessage: err.message,
    })
    logger.error(`Diagnosis AI error for scan ${scan._id}: ${err.message}`)
    throw ApiError.serviceUnavailable('Diagnosis service temporarily unavailable. Please try again.')
  }
 
  const latencyMs = Date.now() - startMs
  const pd        = diagnosis.primaryDiagnosis
  const rec       = diagnosis.recommendations
 
  // ── Update scan with results ──────────────────────────
  await CropScan.findByIdAndUpdate(scan._id, {
    cropType:        pd.crop !== 'Unknown' ? pd.crop : (cropType || 'Unknown'),
    diseaseDetected: pd.disease,
    isHealthy:       pd.isHealthy,
    confidence:      pd.confidence / 100,
    topPredictions:  diagnosis.alternatives.map(a => ({
      label:      a.label,
      confidence: a.confidence / 100,
    })),
    treatments: rec.treatments.map(t => ({
      type:      t.type,
      name:      t.name,
      dosage:    t.dosage,
      frequency: t.frequency,
      notes:     t.notes,
    })),
    advisory: {
      summary:    pd.description,
      prevention: rec.prevention.join(' | '),
      urgency:    pd.severity === 'critical' ? 'critical'
               : pd.severity === 'high'     ? 'high'
               : pd.severity === 'moderate' ? 'medium'
               : 'low',
    },
    mlModelVersion: diagnosis.meta.modelUsed,
    mlLatencyMs:    latencyMs,
    status:         'completed',
  })
 
  const saved = await CropScan.findById(scan._id).lean()
 
  logger.info(`Diagnosis complete: ${pd.disease} in ${pd.crop} — ${pd.confidence}% — ${latencyMs}ms`, {
    scanId: scan._id, userId: req.user?.id,
  })
 
  ApiResponse.created(res, {
    message: pd.isHealthy
      ? `✅ ${pd.crop} appears healthy`
      : `🔬 Detected: ${pd.disease} in ${pd.crop} (${pd.confidence}% confidence)`,
    data: {
      scan:      saved,
      diagnosis: {
        ...diagnosis,
        imageUrl,
        imageWidth:  imageMeta?.width,
        imageHeight: imageMeta?.height,
      },
    },
  })
})
 
// ── GET /api/v1/diagnosis ─────────────────────────────────
export const getScanHistory = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query)
  const userId = req.user?.id
 
  const filter = {}
  if (userId) filter.user = userId
  if (req.query.cropType)  filter.cropType        = { $regex: req.query.cropType, $options: 'i' }
  if (req.query.status)    filter.status           = req.query.status
  if (req.query.disease)   filter.diseaseDetected  = { $regex: req.query.disease, $options: 'i' }
  if (req.query.healthy === 'true')  filter.isHealthy = true
  if (req.query.healthy === 'false') filter.isHealthy = false
 
  const [scans, total] = await Promise.all([
    CropScan.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-__v')
      .lean(),
    CropScan.countDocuments(filter),
  ])
 
  ApiResponse.paginated(res, scans, total, page, limit, 'Scan history retrieved')
})
 
// ── GET /api/v1/diagnosis/stats ───────────────────────────
export const getDiagnosisStats = asyncHandler(async (req, res) => {
  const userId = req.user?.id
  const filter = userId ? { user: userId } : {}
 
  const [total, healthy, byCrop, recentDiseases] = await Promise.all([
    CropScan.countDocuments({ ...filter, status: 'completed' }),
    CropScan.countDocuments({ ...filter, isHealthy: true, status: 'completed' }),
    CropScan.aggregate([
      { $match: { ...filter, status: 'completed' } },
      { $group: { _id: '$cropType', count: { $sum: 1 }, diseases: { $addToSet: '$diseaseDetected' } } },
      { $sort: { count: -1 } },
      { $limit: 8 },
    ]),
    CropScan.find({ ...filter, isHealthy: false, status: 'completed' })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('cropType diseaseDetected confidence createdAt')
      .lean(),
  ])
 
  ApiResponse.success(res, {
    data: {
      total,
      healthy,
      diseased: total - healthy,
      healthRate: total > 0 ? Math.round((healthy / total) * 100) : 0,
      byCrop,
      recentDiseases,
      supportedCrops: SUPPORTED_CROPS,
    },
  })
})
 
// ── GET /api/v1/diagnosis/:id ─────────────────────────────
export const getScanById = asyncHandler(async (req, res) => {
  const filter = { _id: req.params.id }
  if (req.user?.id) filter.user = req.user.id
 
  const scan = await CropScan.findOne(filter).lean()
  if (!scan) throw ApiError.notFound('Scan')
 
  ApiResponse.success(res, { data: scan })
})
 
// ── DELETE /api/v1/diagnosis/:id ──────────────────────────
export const deleteScan = asyncHandler(async (req, res) => {
  const filter = { _id: req.params.id }
  if (req.user?.id) filter.user = req.user.id
 
  const scan = await CropScan.findOneAndDelete(filter)
  if (!scan) throw ApiError.notFound('Scan')
 
  ApiResponse.noContent(res)
})
 
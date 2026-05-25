// src/controllers/diagnosisController.js
// ─────────────────────────────────────────────────────────
// Handles crop disease diagnosis requests.
// Flow:
//   1. Receive image upload (via Multer)
//   2. Forward to Python ML service (FastAPI/Flask)
//   3. Persist result in CropScan collection
//   4. Return enriched result to frontend
// ─────────────────────────────────────────────────────────

import FormData from 'form-data'
import axios from 'axios'
import CropScan from '../models/CropScan.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { ApiError } from '../utils/ApiError.js'
import asyncHandler from '../utils/asyncHandler.js'
import { parsePagination } from '../utils/pagination.js'
import logger from '../utils/logger.js'
import env from '../config/env.js'

// ── POST /api/v1/diagnosis ────────────────────────────────
// Accepts: multipart/form-data with field "image"
export const scanCrop = asyncHandler(async (req, res) => {
  if (!req.file) throw ApiError.badRequest('Image file is required')

  const { cropType = 'Unknown', fieldName } = req.body
  const startMs = Date.now()

  // ── Create a pending scan record ─────────────────────
  const scan = await CropScan.create({
    user:          req.user.id,
    imagePath:     req.file.path || 'memory',
    originalName:  req.file.originalname,
    mimeType:      req.file.mimetype,
    fileSizeBytes: req.file.size,
    cropType,
    fieldName:     fieldName || null,
    status:        'processing',
  })

  // ── Forward image to ML service ───────────────────────
  try {
    const form = new FormData()

    // Memory buffer (cropImageMemory) or disk path (cropImageUpload)
    if (req.file.buffer) {
      form.append('image', req.file.buffer, {
        filename:    req.file.originalname,
        contentType: req.file.mimetype,
      })
    } else {
      const { createReadStream } = await import('fs')
      form.append('image', createReadStream(req.file.path), {
        filename:    req.file.originalname,
        contentType: req.file.mimetype,
      })
    }

    if (cropType && cropType !== 'Unknown') form.append('crop_type', cropType)

    const mlResponse = await axios.post(
      `${env.ML_SERVICE_URL}/predict`,
      form,
      {
        headers:        form.getHeaders(),
        timeout:        env.ML_SERVICE_TIMEOUT_MS,
        maxContentLength: Infinity,
        maxBodyLength:    Infinity,
      }
    )

    const mlData = mlResponse.data

    // ── Build treatment array from ML response ──────────
    const treatments = (mlData.treatments || []).map(t => ({
      type:      t.type      || 'chemical',
      name:      t.name      || '',
      dosage:    t.dosage    || '',
      frequency: t.frequency || '',
      notes:     t.notes     || '',
    }))

    // ── Update scan with ML results ───────────────────
    const latencyMs = Date.now() - startMs
    await scan.updateOne({
      diseaseDetected:  mlData.disease       || 'Unknown',
      isHealthy:        mlData.is_healthy    ?? false,
      confidence:       mlData.confidence    || 0,
      topPredictions:   mlData.top_5         || [],
      treatments,
      advisory: {
        summary:    mlData.advisory?.summary    || '',
        prevention: mlData.advisory?.prevention || '',
        urgency:    mlData.advisory?.urgency    || 'medium',
      },
      mlModelVersion: mlData.model_version  || 'unknown',
      mlLatencyMs:    latencyMs,
      status:         'completed',
    })

    // Fetch updated scan to return
    const result = await CropScan.findById(scan._id).lean()

    logger.info(`Scan completed: ${result.diseaseDetected} in ${result.cropType} — ${latencyMs}ms`, {
      userId: req.user.id,
      scanId: scan._id,
    })

    ApiResponse.created(res, {
      message: 'Crop scan completed',
      data:    result,
    })

  } catch (err) {
    // Mark scan as failed but don't lose the record
    await scan.updateOne({ status: 'failed', errorMessage: err.message })
    logger.error(`ML service error for scan ${scan._id}: ${err.message}`)

    if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND') {
      throw ApiError.serviceUnavailable('Disease detection service is temporarily unavailable')
    }
    if (err.code === 'ECONNABORTED') {
      throw ApiError.serviceUnavailable('Disease detection timed out — please try a smaller image')
    }
    throw err
  }
})

// ── GET /api/v1/diagnosis ────────────────────────────────
// History of all scans for the authenticated user
export const getScanHistory = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query)

  const filter = { user: req.user.id }
  if (req.query.cropType)  filter.cropType = req.query.cropType
  if (req.query.status)    filter.status   = req.query.status

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

// ── GET /api/v1/diagnosis/:id ─────────────────────────────
export const getScanById = asyncHandler(async (req, res) => {
  const scan = await CropScan.findOne({
    _id:  req.params.id,
    user: req.user.id,
  }).lean()

  if (!scan) throw ApiError.notFound('Scan')

  ApiResponse.success(res, { data: scan })
})

// ── DELETE /api/v1/diagnosis/:id ─────────────────────────
export const deleteScan = asyncHandler(async (req, res) => {
  const scan = await CropScan.findOneAndDelete({
    _id:  req.params.id,
    user: req.user.id,
  })

  if (!scan) throw ApiError.notFound('Scan')

  ApiResponse.noContent(res)
})

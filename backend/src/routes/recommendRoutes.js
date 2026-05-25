// src/routes/recommendRoutes.js
// ─────────────────────────────────────────────────────────
// Crop recommendation routes.
// Mounted at /api/v1/recommend in src/routes/index.js
//
// POST   /api/v1/recommend          — run ML + rule engine
// GET    /api/v1/recommend          — paginated history
// GET    /api/v1/recommend/stats    — usage stats
// GET    /api/v1/recommend/:id      — single record
// DELETE /api/v1/recommend/:id      — delete record
// ─────────────────────────────────────────────────────────

import { Router }   from 'express'
import { body, param } from 'express-validator'
import {
  getCropRecommendation,
  getRecommendationHistory,
  getRecommendationStats,
  getRecommendationById,
  deleteRecommendation,
} from '../controllers/recommendController.js'
import validate          from '../middleware/validate.js'
import { mlLimiter }     from '../middleware/rateLimiter.js'

const router = Router()

// ── Validation chain for POST ─────────────────────────────
const recommendValidation = [
  body('nitrogen')
    .notEmpty().withMessage('Nitrogen (N) is required')
    .isFloat({ min: 0, max: 500 }).withMessage('Nitrogen must be 0–500 kg/ha')
    .toFloat(),
  body('phosphorus')
    .notEmpty().withMessage('Phosphorus (P) is required')
    .isFloat({ min: 0, max: 500 }).withMessage('Phosphorus must be 0–500 kg/ha')
    .toFloat(),
  body('potassium')
    .notEmpty().withMessage('Potassium (K) is required')
    .isFloat({ min: 0, max: 500 }).withMessage('Potassium must be 0–500 kg/ha')
    .toFloat(),
  body('temperature')
    .notEmpty().withMessage('Temperature is required')
    .isFloat({ min: -10, max: 60 }).withMessage('Temperature must be -10 to 60 °C')
    .toFloat(),
  body('humidity')
    .notEmpty().withMessage('Humidity is required')
    .isFloat({ min: 0, max: 100 }).withMessage('Humidity must be 0–100 %')
    .toFloat(),
  body('ph')
    .notEmpty().withMessage('pH is required')
    .isFloat({ min: 0, max: 14 }).withMessage('pH must be 0–14')
    .toFloat(),
  body('rainfall')
    .notEmpty().withMessage('Rainfall is required')
    .isFloat({ min: 0, max: 5000 }).withMessage('Rainfall must be 0–5000 mm')
    .toFloat(),
  // Optional context fields
  body('state').optional().trim(),
  body('district').optional().trim(),
  body('season').optional().isIn(['kharif', 'rabi', 'zaid', 'year-round', '']),
  body('soilType').optional().trim(),
  body('fieldName').optional().trim(),
]

// IMPORTANT: /stats must come BEFORE /:id to avoid being matched as an id
router.get('/stats',     getRecommendationStats)

router.post('/',
  mlLimiter,
  recommendValidation,
  validate,
  getCropRecommendation
)

router.get('/',          getRecommendationHistory)

router.get('/:id',
  [param('id').isMongoId().withMessage('Invalid recommendation ID')],
  validate,
  getRecommendationById
)

router.delete('/:id',
  [param('id').isMongoId().withMessage('Invalid recommendation ID')],
  validate,
  deleteRecommendation
)

export default router
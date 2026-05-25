// backend/src/routes/diagnosisRoutes.js
// ─────────────────────────────────────────────────────────
// Replace the existing diagnosisRoutes.js in agrovision-backend/src/routes/
// ─────────────────────────────────────────────────────────
 
import { Router }  from 'express'
import { param }   from 'express-validator'
import {
  scanCrop, getScanHistory, getScanById,
  deleteScan, getDiagnosisStats,
} from '../controllers/diagnosisController.js'
import { authenticate }         from '../middleware/auth.js'
import { mlLimiter, uploadLimiter } from '../middleware/rateLimiter.js'
import { cropImageMemory }      from '../middleware/upload.js'
import validate                 from '../middleware/validate.js'
 
const router = Router()
 
// Optional auth — allow anonymous scans for demo/testing
// Switch to `authenticate` to require login
const optAuth = (req, res, next) => {
  // If you want to require auth, replace this with: authenticate(req, res, next)
  try { require('../middleware/auth.js').authenticate(req, res, next) }
  catch { next() }
}
 
// ── Stats (no auth required for public dashboards) ────────
router.get('/stats', getDiagnosisStats)
 
// ── Submit image for diagnosis ─────────────────────────────
router.post('/',
  uploadLimiter,
  mlLimiter,
  cropImageMemory.single('image'),   // field name: "image"
  scanCrop
)
 
// ── Scan history ──────────────────────────────────────────
router.get('/', getScanHistory)
 
// ── Single scan ───────────────────────────────────────────
router.get('/:id',
  [param('id').isMongoId().withMessage('Invalid scan ID')],
  validate,
  getScanById
)
 
// ── Delete scan ───────────────────────────────────────────
router.delete('/:id',
  [param('id').isMongoId().withMessage('Invalid scan ID')],
  validate,
  deleteScan
)
 
export default router
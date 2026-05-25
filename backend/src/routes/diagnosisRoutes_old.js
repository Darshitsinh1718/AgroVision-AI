// src/routes/diagnosisRoutes.js
// POST   /api/v1/diagnosis         — submit image for disease scan
// GET    /api/v1/diagnosis         — get scan history
// GET    /api/v1/diagnosis/:id     — get single scan
// DELETE /api/v1/diagnosis/:id     — delete scan

import { Router } from 'express'
import { param } from 'express-validator'
import {
  scanCrop, getScanHistory, getScanById, deleteScan
} from '../controllers/diagnosisController.js'
import { authenticate }                            from '../middleware/auth.js'
import { mlLimiter, uploadLimiter }                from '../middleware/rateLimiter.js'
import { cropImageMemory }                         from '../middleware/upload.js'
import validate                                    from '../middleware/validate.js'

const router = Router()

// All diagnosis routes require authentication
router.use(authenticate)

router.post('/',
  uploadLimiter,
  mlLimiter,
  cropImageMemory.single('image'),  // 'image' = form field name
  scanCrop
)

router.get('/', getScanHistory)

router.get('/:id',
  [param('id').isMongoId().withMessage('Invalid scan ID')],
  validate,
  getScanById
)

router.delete('/:id',
  [param('id').isMongoId().withMessage('Invalid scan ID')],
  validate,
  deleteScan
)

export default router

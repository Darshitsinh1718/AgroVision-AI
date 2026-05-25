// src/routes/healthRoutes.js
// GET /api/v1/health        — liveness probe
// GET /api/v1/health/deep   — readiness probe (checks DB + ML)

import { Router } from 'express'
import { ping, deepCheck } from '../controllers/healthController.js'

const router = Router()

router.get('/',     ping)
router.get('/deep', deepCheck)

export default router

// src/routes/index.js
// ─────────────────────────────────────────────────────────
// Master API router — mounts all feature routers.
// Imported by app.js and mounted at /api/v1
// ─────────────────────────────────────────────────────────

import { Router } from 'express'

import healthRoutes from './healthRoutes.js'
import authRoutes from './authRoutes.js'
import diagnosisRoutes from './diagnosisRoutes.js'
import recommendRoutes from './recommendRoutes.js'
import weatherRoutes from './weatherRoutes.js'
import userRoutes from './userRoutes.js'
import marketRoutes from './marketRoutes.js'

const router = Router()

// Health check
router.use('/health', healthRoutes)

// Authentication
router.use('/auth', authRoutes)

// Feature modules
router.use('/diagnosis', diagnosisRoutes)
router.use('/recommend', recommendRoutes)
router.use('/weather', weatherRoutes)
router.use('/market', marketRoutes)

// User/Profile
router.use('/users', userRoutes)

export default router
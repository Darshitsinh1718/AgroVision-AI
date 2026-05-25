// src/controllers/healthController.js
// ─────────────────────────────────────────────────────────
// Health check endpoints used by:
//   • Load balancers (liveness probe)
//   • Deployment pipelines (readiness probe)
//   • Monitoring dashboards
// ─────────────────────────────────────────────────────────

import mongoose from 'mongoose'
import { ApiResponse } from '../utils/ApiResponse.js'
import { isConnected } from '../config/database.js'
import asyncHandler from '../utils/asyncHandler.js'
import env from '../config/env.js'
import logger from '../utils/logger.js'

const startTime = Date.now()

// ── GET /api/v1/health ───────────────────────────────────
// Basic liveness probe — returns 200 if server is running
export const ping = asyncHandler(async (req, res) => {
  ApiResponse.success(res, {
    message: 'AgroVision API is running',
    data: {
      status:    'ok',
      timestamp: new Date().toISOString(),
      uptime:    `${Math.round((Date.now() - startTime) / 1000)}s`,
    },
  })
})

// ── GET /api/v1/health/deep ──────────────────────────────
// Deep readiness probe — checks DB, memory, uptime
export const deepCheck = asyncHandler(async (req, res) => {
  const dbConnected = isConnected()

  // Memory usage
  const mem     = process.memoryUsage()
  const memMB   = (bytes) => `${Math.round(bytes / 1024 / 1024)}MB`

  // Check ML service reachability (optional)
  let mlServiceOk = null
  try {
    const { default: axios } = await import('axios')
    await axios.get(`${env.ML_SERVICE_URL}/health`, { timeout: 3000 })
    mlServiceOk = true
  } catch {
    mlServiceOk = false
  }

  const checks = {
    server:    'ok',
    database:  dbConnected ? 'ok' : 'error',
    mlService: mlServiceOk === null ? 'unknown' : mlServiceOk ? 'ok' : 'degraded',
  }

  const allOk   = Object.values(checks).every(v => v === 'ok' || v === 'unknown')
  const status  = allOk ? 200 : 503

  logger.debug('Health deep check', checks)

  return res.status(status).json({
    success: allOk,
    message: allOk ? 'All systems operational' : 'Some services degraded',
    data: {
      checks,
      uptime: `${Math.round((Date.now() - startTime) / 1000)}s`,
      memory: {
        heapUsed:  memMB(mem.heapUsed),
        heapTotal: memMB(mem.heapTotal),
        rss:       memMB(mem.rss),
      },
      node:       process.version,
      env:        env.NODE_ENV,
      version:    'v1.0.0',
      db: {
        readyState: mongoose.connection.readyState,
        host:       mongoose.connection.host || 'not connected',
      },
    },
  })
})

// src/middleware/requestLogger.js
// ─────────────────────────────────────────────────────────
// HTTP request logger using Morgan + Winston stream.
// Dev:  colourized concise format (:method :url :status :response-time)
// Prod: combined format (Apache-like) → written to combined.log
// Skips health-check pings to reduce log noise.
// ─────────────────────────────────────────────────────────

import morgan from 'morgan'
import logger from '../utils/logger.js'
import env from '../config/env.js'

// Custom token: request body (sanitised — no passwords)
morgan.token('body', (req) => {
  if (!req.body || Object.keys(req.body).length === 0) return '-'
  // Redact sensitive fields before logging
  const safe = { ...req.body }
  for (const key of ['password', 'passwordConfirm', 'token', 'secret']) {
    if (key in safe) safe[key] = '[REDACTED]'
  }
  return JSON.stringify(safe)
})

// Custom token: authenticated user ID
morgan.token('userId', (req) => req.user?.id || 'anonymous')

// ── Format strings ───────────────────────────────────────
const DEV_FORMAT  = ':method :url :status :response-time ms — :res[content-length] bytes'
const PROD_FORMAT = ':remote-addr :userId :method :url HTTP/:http-version :status :res[content-length] ":referrer" ":user-agent" :response-time ms'

const format = env.IS_DEV ? DEV_FORMAT : PROD_FORMAT

// ── Skip health checks and static assets ─────────────────
function skip(req) {
  return req.url === '/api/v1/health' || req.url.startsWith('/static')
}

const requestLogger = morgan(format, {
  stream: logger.stream,
  skip,
})

export default requestLogger

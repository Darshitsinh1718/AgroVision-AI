// src/middleware/errorHandler.js
// ─────────────────────────────────────────────────────────
// Global Express error handler (must be registered LAST in app.js).
// Normalises all error types into the standard API envelope:
//
//  { success: false, message: "...", errors: [], stack: "..." }
//
// Handled error types:
//   • ApiError          — our own thrown errors
//   • ValidationError   — Mongoose schema validation
//   • CastError         — invalid Mongoose ObjectId
//   • MongoServerError  — duplicate key (code 11000)
//   • JsonWebTokenError — invalid JWT
//   • TokenExpiredError — expired JWT
//   • MulterError       — file upload errors
//   • SyntaxError       — malformed JSON body
//   • Everything else   — 500 Internal Server Error
// ─────────────────────────────────────────────────────────

import { ApiError } from '../utils/ApiError.js'
import logger from '../utils/logger.js'
import env from '../config/env.js'

// ── Error normaliser — converts any error to ApiError ──
function normalise(err) {
  // Already our own typed error
  if (err.isApiError) return err

  // Mongoose: invalid ObjectId (e.g. /api/crops/not-an-id)
  if (err.name === 'CastError') {
    return new ApiError(400, `Invalid ${err.path}: "${err.value}" is not a valid ID`)
  }

  // Mongoose: schema validation errors
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => ({
      field:   e.path,
      message: e.message,
    }))
    return new ApiError(422, 'Validation failed', errors)
  }

  // MongoDB: duplicate key (e.g. unique email)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field'
    const value = err.keyValue?.[field]
    return new ApiError(409, `"${value}" is already in use for ${field}`)
  }

  // JWT: invalid signature or malformed token
  if (err.name === 'JsonWebTokenError') {
    return new ApiError(401, 'Invalid token — please log in again')
  }

  // JWT: token expired
  if (err.name === 'TokenExpiredError') {
    return new ApiError(401, 'Token expired — please log in again')
  }

  // Multer: file upload issues
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return new ApiError(413, `File too large — maximum size is ${env.MAX_FILE_SIZE_MB}MB`)
    }
    return new ApiError(400, `Upload error: ${err.message}`)
  }

  // Malformed JSON body
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return new ApiError(400, 'Invalid JSON in request body')
  }

  // Default: unknown internal error
  return new ApiError(500, env.IS_PROD ? 'Internal server error' : err.message)
}

// ── Global error handler ──────────────────────────────────
// eslint-disable-next-line no-unused-vars
export default function errorHandler(err, req, res, next) {
  const apiError = normalise(err)

  // Log server errors (5xx) as errors; client errors (4xx) as warnings
  const logMethod = apiError.statusCode >= 500 ? 'error' : 'warn'
  logger[logMethod]({
    message:    apiError.message,
    statusCode: apiError.statusCode,
    method:     req.method,
    url:        req.originalUrl,
    ip:         req.ip,
    userId:     req.user?.id || 'anonymous',
    stack:      err.stack,
  })

  const body = {
    success:    false,
    message:    apiError.message,
    ...(apiError.errors?.length > 0 && { errors: apiError.errors }),
    // Only expose stack trace in development
    ...(env.IS_DEV && { stack: err.stack }),
  }

  return res.status(apiError.statusCode).json(body)
}

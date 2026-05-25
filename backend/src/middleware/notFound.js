// src/middleware/notFound.js
// ─────────────────────────────────────────────────────────
// Catches all requests that don't match any route and
// forwards a 404 ApiError to errorHandler.
// Must be registered AFTER all routes, BEFORE errorHandler.
// ─────────────────────────────────────────────────────────

import { ApiError } from '../utils/ApiError.js'

export default function notFound(req, res, next) {
  next(ApiError.notFound(`Route ${req.method} ${req.originalUrl}`))
}

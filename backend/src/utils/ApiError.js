// src/utils/ApiError.js
// ─────────────────────────────────────────────────────────
// Custom Error subclass that carries HTTP status codes and
// optional field-level validation errors.
// All controllers throw ApiError; the errorHandler middleware
// catches it and formats the response.
//
// Usage:
//   throw new ApiError(404, 'Crop not found')
//   throw new ApiError(422, 'Validation failed', errors)
//   throw ApiError.badRequest('Invalid NPK values')
//   throw ApiError.unauthorized()
//   throw ApiError.notFound('Field')
// ─────────────────────────────────────────────────────────

export class ApiError extends Error {
  /**
   * @param {number} statusCode - HTTP status code
   * @param {string} message    - Human-readable message
   * @param {Array}  [errors]   - Field-level validation errors
   * @param {string} [stack]    - Override stack (testing)
   */
  constructor(statusCode, message, errors = [], stack = '') {
    super(message)
    this.name       = 'ApiError'
    this.statusCode = statusCode
    this.errors     = errors
    this.isApiError = true   // Discriminator for errorHandler

    if (stack) {
      this.stack = stack
    } else {
      Error.captureStackTrace(this, this.constructor)
    }
  }

  // ── Static factory methods ───────────────────────────
  static badRequest(message = 'Bad request', errors = []) {
    return new ApiError(400, message, errors)
  }

  static unauthorized(message = 'Authentication required') {
    return new ApiError(401, message)
  }

  static forbidden(message = 'Insufficient permissions') {
    return new ApiError(403, message)
  }

  static notFound(resource = 'Resource') {
    return new ApiError(404, `${resource} not found`)
  }

  static conflict(message = 'Resource already exists') {
    return new ApiError(409, message)
  }

  static unprocessable(message = 'Validation failed', errors = []) {
    return new ApiError(422, message, errors)
  }

  static tooManyRequests(message = 'Too many requests, please try again later') {
    return new ApiError(429, message)
  }

  static internal(message = 'Internal server error') {
    return new ApiError(500, message)
  }

  static serviceUnavailable(message = 'Service temporarily unavailable') {
    return new ApiError(503, message)
  }
}

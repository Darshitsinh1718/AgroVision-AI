// src/middleware/validate.js
// ─────────────────────────────────────────────────────────
// Runs after express-validator chains and aggregates errors.
// If validation failed → throws 422 ApiError with field list.
// If validation passed → calls next() to reach the controller.
//
// Usage:
//   router.post('/',
//     [body('email').isEmail(), body('npk').isNumeric()],
//     validate,          ← this middleware
//     asyncHandler(controller)
//   )
// ─────────────────────────────────────────────────────────

import { validationResult } from 'express-validator'
import { ApiError } from '../utils/ApiError.js'

export default function validate(req, res, next) {
  const result = validationResult(req)

  if (result.isEmpty()) return next()

  // Format errors: [{ field, message, value }]
  const errors = result.array().map(err => ({
    field:   err.path || err.param,
    message: err.msg,
    value:   err.value,
  }))

  next(ApiError.unprocessable('Validation failed', errors))
}

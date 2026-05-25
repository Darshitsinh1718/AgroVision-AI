// src/utils/asyncHandler.js
// ─────────────────────────────────────────────────────────
// Higher-order function that wraps async Express handlers.
// Catches any thrown error (including ApiError) and passes
// it to next() so errorHandler middleware processes it.
//
// Usage in controllers:
//   router.get('/crop', asyncHandler(async (req, res) => {
//     const data = await CropService.getAll()
//     ApiResponse.success(res, { data })
//   }))
//
// Without this wrapper every handler needs its own try/catch.
// ─────────────────────────────────────────────────────────

/**
 * @param {Function} fn - Async express route handler
 * @returns {Function}  - Wrapped handler with error forwarding
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next)
}

export default asyncHandler

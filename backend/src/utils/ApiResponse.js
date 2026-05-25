// src/utils/ApiResponse.js
// ─────────────────────────────────────────────────────────
// Standardised JSON response envelope for ALL API responses.
// Every endpoint returns the same shape — makes frontend
// integration and error handling predictable.
//
// Success shape:
// {
//   "success": true,
//   "message": "...",
//   "data": { ... },
//   "meta": { "page": 1, "total": 42 }   ← optional pagination
// }
//
// Error shape (handled by errorHandler middleware):
// {
//   "success": false,
//   "message": "...",
//   "errors": [ ... ],
//   "stack": "..."   ← only in development
// }
// ─────────────────────────────────────────────────────────

export class ApiResponse {
  /**
   * Send a success response.
   * @param {import('express').Response} res
   * @param {object} options
   * @param {number}  [options.statusCode=200]
   * @param {string}  [options.message='Success']
   * @param {*}       [options.data=null]
   * @param {object}  [options.meta=null]    - pagination, counts, etc.
   */
  static success(res, {
    statusCode = 200,
    message    = 'Success',
    data       = null,
    meta       = null,
  } = {}) {
    const body = { success: true, message }
    if (data !== null && data !== undefined) body.data = data
    if (meta !== null && meta !== undefined) body.meta = meta
    return res.status(statusCode).json(body)
  }

  /** Alias for 201 Created */
  static created(res, { message = 'Created successfully', data = null, meta = null } = {}) {
    return ApiResponse.success(res, { statusCode: 201, message, data, meta })
  }

  /** Alias for 204 No Content */
  static noContent(res) {
    return res.status(204).send()
  }

  /**
   * Build a paginated response with standardised meta block.
   * @param {import('express').Response} res
   * @param {Array}  docs        - The result array
   * @param {number} total       - Total matching documents
   * @param {number} page        - Current page (1-based)
   * @param {number} limit       - Items per page
   * @param {string} [message]
   */
  static paginated(res, docs, total, page, limit, message = 'Success') {
    return ApiResponse.success(res, {
      message,
      data: docs,
      meta: {
        total,
        page,
        limit,
        pages:   Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    })
  }
}

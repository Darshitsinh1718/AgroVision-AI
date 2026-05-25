// src/utils/pagination.js
// ─────────────────────────────────────────────────────────
// Reusable pagination helpers for Mongoose.
// Extracts page/limit from query params, validates them,
// and builds skip/limit for Mongoose queries.
// ─────────────────────────────────────────────────────────

/**
 * Parse and validate pagination params from req.query.
 * @param {object} query - req.query
 * @returns {{ page, limit, skip }}
 */
export function parsePagination(query) {
  const page  = Math.max(1, parseInt(query.page,  10) || 1)
  const limit = Math.min(100, Math.max(1, parseInt(query.limit, 10) || 20))
  const skip  = (page - 1) * limit
  return { page, limit, skip }
}

/**
 * Generic paginated Mongoose query helper.
 * @param {import('mongoose').Model} Model
 * @param {object} filter    - Mongoose filter
 * @param {object} options
 * @param {object} [options.sort]    - Mongoose sort object
 * @param {string} [options.select]  - Fields to select
 * @param {Array}  [options.populate] - Populate paths
 * @param {number} options.page
 * @param {number} options.limit
 * @param {number} options.skip
 * @returns {{ docs, total, page, limit }}
 */
export async function paginate(Model, filter = {}, { sort = { createdAt: -1 }, select = '', populate = [], page, limit, skip }) {
  let query = Model.find(filter).sort(sort).skip(skip).limit(limit)

  if (select)              query = query.select(select)
  if (populate.length > 0) populate.forEach(p => { query = query.populate(p) })

  const [docs, total] = await Promise.all([
    query.lean(),
    Model.countDocuments(filter),
  ])

  return { docs, total, page, limit }
}

// src/middleware/rateLimiter.js
// ─────────────────────────────────────────────────────────
// Tiered rate limiting using express-rate-limit.
// Three limiters:
//   • general   — 100 req / 15min  (all API routes)
//   • auth      — 10  req / 15min  (login/register — brute-force protection)
//   • mlService — 30  req / 15min  (crop diagnosis — expensive ML calls)
//   • upload    — 20  req / 15min  (file upload endpoints)
// ─────────────────────────────────────────────────────────

import rateLimit from 'express-rate-limit'
import { ApiError } from '../utils/ApiError.js'
import env from '../config/env.js'

// Shared handler for when limit is exceeded
function onLimitReached(req, res, next, options) {
  next(new ApiError(429, options.message))
}

// ── General limiter ──────────────────────────────────────
export const generalLimiter = rateLimit({
  windowMs:         env.RATE_LIMIT_WINDOW_MS,   // 15 minutes
  max:              env.RATE_LIMIT_MAX,          // 100 requests
  standardHeaders:  true,     // Return X-RateLimit-* headers
  legacyHeaders:    false,    // Disable X-RateLimit-* legacy headers
  message:          'Too many requests from this IP. Please try again in 15 minutes.',
  handler:          onLimitReached,
  skip:             (req) => env.IS_DEV,  // Skip in development
})

// ── Auth limiter (strict — prevents brute force) ─────────
export const authLimiter = rateLimit({
  windowMs:   15 * 60 * 1000,   // 15 minutes
  max:        10,                // Only 10 login attempts per window
  message:    'Too many login attempts. Account temporarily locked for 15 minutes.',
  handler:    onLimitReached,
  skipSuccessfulRequests: true,  // Don't count successful logins
})

// ── ML service limiter (expensive compute) ───────────────
export const mlLimiter = rateLimit({
  windowMs:   15 * 60 * 1000,
  max:        30,
  message:    'Too many analysis requests. Please wait before submitting another scan.',
  handler:    onLimitReached,
})

// ── Upload limiter ────────────────────────────────────────
export const uploadLimiter = rateLimit({
  windowMs:   15 * 60 * 1000,
  max:        20,
  message:    'Too many file uploads. Please try again later.',
  handler:    onLimitReached,
})

// src/app.js
// ─────────────────────────────────────────────────────────
// Express application factory.
// Creates and configures the Express app with all middleware
// in the correct order. Separated from server.js so the app
// can be imported and tested without starting a real server.
//
// Middleware order (matters!):
//   1. Security headers (helmet)
//   2. CORS
//   3. Request logger (morgan)
//   4. Body parsers
//   5. Cookie parser
//   6. Compression
//   7. Sanitisation (NoSQL injection, XSS, HPP)
//   8. Rate limiter (global)
//   9. Routes
//  10. 404 handler
//  11. Global error handler  ← MUST be last
// ─────────────────────────────────────────────────────────

import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import mongoSanitize from 'express-mongo-sanitize'
import xssClean from 'xss-clean'
import hpp from 'hpp'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

import env           from './config/env.js'
import requestLogger from './middleware/requestLogger.js'
import { generalLimiter } from './middleware/rateLimiter.js'
import notFound      from './middleware/notFound.js'
import errorHandler  from './middleware/errorHandler.js'
import apiRoutes     from './routes/index.js'
import logger        from './utils/logger.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

const app = express()

// ── 1. Security headers (Helmet) ─────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },   // Allow serving uploaded images
  contentSecurityPolicy: env.IS_PROD ? undefined : false,  // Relax CSP in dev
}))

// ── 2. CORS ───────────────────────────────────────────────
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, curl)
    if (!origin) return callback(null, true)
    if (env.ALLOWED_ORIGINS.includes(origin)) return callback(null, true)
    logger.warn(`CORS blocked request from origin: ${origin}`)
    callback(new Error(`Origin ${origin} not allowed by CORS policy`))
  },
  credentials:    true,    // Allow cookies
  methods:        ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['X-RateLimit-Limit', 'X-RateLimit-Remaining'],
}))

// ── 3. Request logger ─────────────────────────────────────
app.use(requestLogger)

// ── 4. Body parsers ───────────────────────────────────────
app.use(express.json({
  limit:  '10mb',
  strict: true,
}))
app.use(express.urlencoded({
  extended: true,
  limit:    '10mb',
}))

// ── 5. Cookie parser ──────────────────────────────────────
app.use(cookieParser(env.COOKIE_SECRET))

// ── 6. Gzip compression ───────────────────────────────────
app.use(compression())

// ── 7. Security sanitisation ──────────────────────────────
// Prevent MongoDB operator injection: { "$gt": "" } → sanitised
app.use(mongoSanitize({
  allowDots:            true,
  replaceWith:          '_',
  onSanitizeError:      (req, res) => {
    logger.warn(`NoSQL injection attempt from ${req.ip}: ${req.originalUrl}`)
  },
}))

// Prevent XSS: sanitise HTML from user inputs
app.use(xssClean())

// Prevent HTTP Parameter Pollution: ?sort=name&sort=price → uses last value
app.use(hpp({
  whitelist: ['sort', 'fields', 'page', 'limit'],  // Allow duplicates for these
}))

// ── 8. Global rate limiter ────────────────────────────────
app.use(`/api/${env.API_VERSION}`, generalLimiter)

// ── 9. Static file serving (uploaded images) ─────────────
const uploadDir = resolve(__dirname, '../', env.UPLOAD_DIR)
app.use('/uploads', express.static(uploadDir, {
  maxAge:  '1d',
  etag:    true,
  index:   false,     // Don't expose directory listing
}))

// ── 10. API Routes ────────────────────────────────────────
app.use(`/api/${env.API_VERSION}`, apiRoutes)

// ── 11. 404 handler ───────────────────────────────────────
app.use(notFound)

// ── 12. Global error handler (MUST be last) ───────────────
app.use(errorHandler)

export default app

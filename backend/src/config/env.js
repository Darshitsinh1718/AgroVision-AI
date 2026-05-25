// src/config/env.js
// ─────────────────────────────────────────────────────────
// Loads .env, validates required variables, and exports a
// single frozen config object. The server refuses to start
// if any required variable is missing — fail-fast pattern.
// ─────────────────────────────────────────────────────────

import { config } from 'dotenv'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Load .env from project root (two levels up from src/config/)
config({ path: resolve(__dirname, '../../.env') })

// ── Required variables — server won't start without these ──
const REQUIRED = [
  'MONGO_URI',
  'JWT_SECRET',
  'JWT_REFRESH_SECRET',
  'COOKIE_SECRET',
]

const missing = REQUIRED.filter(key => !process.env[key])
if (missing.length > 0) {
  console.error(`\n❌  Missing required environment variables:\n   ${missing.join('\n   ')}\n`)
  console.error('   → Copy .env.example to .env and fill in values.\n')
  process.exit(1)
}

// ── Export single config object (frozen — no runtime mutation) ──
const env = Object.freeze({
  // Server
  NODE_ENV:    process.env.NODE_ENV    || 'development',
  PORT:        parseInt(process.env.PORT, 10) || 5000,
  API_VERSION: process.env.API_VERSION || 'v1',
  APP_NAME:    process.env.APP_NAME    || 'AgroVision AI',
  IS_PROD:     process.env.NODE_ENV === 'production',
  IS_DEV:      process.env.NODE_ENV === 'development',
  IS_TEST:     process.env.NODE_ENV === 'test',

  // MongoDB
  MONGO_URI:     process.env.MONGO_URI,
  MONGO_DB_NAME: process.env.MONGO_DB_NAME || 'agrovision',

  // JWT
  JWT_SECRET:             process.env.JWT_SECRET,
  JWT_EXPIRES_IN:         process.env.JWT_EXPIRES_IN          || '7d',
  JWT_REFRESH_SECRET:     process.env.JWT_REFRESH_SECRET,
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN  || '30d',

  // Cookie
  COOKIE_SECRET: process.env.COOKIE_SECRET,

  // CORS
  ALLOWED_ORIGINS: (process.env.ALLOWED_ORIGINS || 'http://localhost:5173')
    .split(',')
    .map(o => o.trim()),

  // Rate limiting
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 900000,
  RATE_LIMIT_MAX:       parseInt(process.env.RATE_LIMIT_MAX, 10)       || 100,

  // File upload
  MAX_FILE_SIZE_MB: parseInt(process.env.MAX_FILE_SIZE_MB, 10) || 10,
  UPLOAD_DIR:       process.env.UPLOAD_DIR || 'uploads',

  // Logging
  LOG_LEVEL: process.env.LOG_LEVEL || 'debug',
  LOG_DIR:   process.env.LOG_DIR   || 'logs',

  // External APIs
  OPENWEATHER_API_KEY:  process.env.OPENWEATHER_API_KEY  || '',
  OPENWEATHER_BASE_URL: process.env.OPENWEATHER_BASE_URL || 'https://api.openweathermap.org/data/2.5',

  AGROMONITORING_API_KEY:  process.env.AGROMONITORING_API_KEY  || '',
  AGROMONITORING_BASE_URL: process.env.AGROMONITORING_BASE_URL || 'https://app.agromonitoring.com/agro/1.0',

  // ML Microservice
  ML_SERVICE_URL:        process.env.ML_SERVICE_URL        || 'http://localhost:8000',
  ML_SERVICE_TIMEOUT_MS: parseInt(process.env.ML_SERVICE_TIMEOUT_MS, 10) || 15000,

  // Email
  SMTP_HOST:  process.env.SMTP_HOST  || '',
  SMTP_PORT:  parseInt(process.env.SMTP_PORT, 10) || 587,
  SMTP_USER:  process.env.SMTP_USER  || '',
  SMTP_PASS:  process.env.SMTP_PASS  || '',
  EMAIL_FROM: process.env.EMAIL_FROM || 'noreply@agrovision.ai',
})

export default env

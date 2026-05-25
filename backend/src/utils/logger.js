// src/utils/logger.js
// ─────────────────────────────────────────────────────────
// Winston logger with:
//   • Console output (colorized, human-readable in dev)
//   • Daily rotating log files (combined.log + error.log)
//   • Structured JSON for production log aggregation
//   • Morgan-compatible stream for HTTP request logging
// ─────────────────────────────────────────────────────────

import { createLogger, format, transports } from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { mkdirSync } from 'fs'
import env from '../config/env.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const LOG_DIR   = resolve(__dirname, '../../', env.LOG_DIR)

// Ensure log directory exists
mkdirSync(LOG_DIR, { recursive: true })

// ── Custom formats ──────────────────────────────────────
const { combine, timestamp, errors, json, colorize, printf, splat } = format

// Human-readable format for console (development)
const consoleFormat = combine(
  colorize({ all: true }),
  timestamp({ format: 'HH:mm:ss' }),
  errors({ stack: true }),
  splat(),
  printf(({ timestamp, level, message, stack, ...meta }) => {
    const metaStr = Object.keys(meta).length ? `\n  ${JSON.stringify(meta, null, 2)}` : ''
    return `${timestamp} [${level}] ${stack || message}${metaStr}`
  })
)

// Structured JSON format for files (production-friendly)
const fileFormat = combine(
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
  errors({ stack: true }),
  splat(),
  json()
)

// ── Rotating file transport factory ──
function rotatingFile(filename, level) {
  return new DailyRotateFile({
    filename:      `${LOG_DIR}/${filename}-%DATE%.log`,
    datePattern:   'YYYY-MM-DD',
    level,
    format:        fileFormat,
    maxSize:       '20m',     // Rotate when file hits 20MB
    maxFiles:      '14d',     // Keep 14 days of logs
    zippedArchive: true,      // Compress rotated files
  })
}

// ── Logger instance ──────────────────────────────────────
const logger = createLogger({
  level:      env.LOG_LEVEL,
  exitOnError: false,
  transports: [
    // All levels → combined.log
    rotatingFile('combined', env.LOG_LEVEL),
    // Error-only → error.log
    rotatingFile('error', 'error'),
    // Console — colorized in dev, minimal in prod
    new transports.Console({
      format:  env.IS_DEV ? consoleFormat : fileFormat,
      silent:  env.IS_TEST,   // Suppress output during tests
    }),
  ],
})

// ── Morgan HTTP stream ────────────────────────────────────
// Passes Morgan's request log lines into Winston
logger.stream = {
  write: (message) => logger.http(message.trim()),
}

export default logger

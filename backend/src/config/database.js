// src/config/database.js
// ─────────────────────────────────────────────────────────
// Manages the MongoDB connection via Mongoose.
// Features:
//   • Retry on initial connection failure (5 attempts, exp backoff)
//   • Connection event listeners (connected, disconnected, error)
//   • Graceful shutdown handler (closes connection on SIGINT/SIGTERM)
//   • Singleton pattern — importable everywhere, connects once
// ─────────────────────────────────────────────────────────

import mongoose from 'mongoose'
import env from './env.js'
import logger from '../utils/logger.js'

// ── Mongoose global settings ──
mongoose.set('strictQuery', true)   // Throw on unknown query fields
mongoose.set('debug', env.IS_DEV)   // Log queries in development

const MONGO_OPTIONS = {
  dbName:             env.MONGO_DB_NAME,
  maxPoolSize:        10,       // Max simultaneous connections in pool
  minPoolSize:        2,        // Keep at least 2 alive
  socketTimeoutMS:    45_000,   // Close idle sockets after 45s
  serverSelectionTimeoutMS: 10_000,  // Give up finding a server after 10s
  heartbeatFrequencyMS:     10_000,  // Ping server every 10s
  autoIndex:          !env.IS_PROD,  // Don't auto-build indexes in prod
}

// ── Retry config ──
const MAX_RETRIES    = 5
const BASE_DELAY_MS  = 1000   // 1s initial delay, doubles each retry

// ── Connection event listeners ──
function attachListeners() {
  mongoose.connection.on('connected', () => {
    logger.info(`🍃  MongoDB connected → ${mongoose.connection.host}/${mongoose.connection.name}`)
  })

  mongoose.connection.on('disconnected', () => {
    logger.warn('⚡  MongoDB disconnected')
  })

  mongoose.connection.on('reconnected', () => {
    logger.info('🔄  MongoDB reconnected')
  })

  mongoose.connection.on('error', (err) => {
    logger.error(`MongoDB error: ${err.message}`)
  })
}

// ── Connect with retry ──
export async function connectDB(attempt = 1) {
  try {
    attachListeners()
    await mongoose.connect(env.MONGO_URI, MONGO_OPTIONS)
  } catch (err) {
    if (attempt >= MAX_RETRIES) {
      logger.error(`❌  MongoDB connection failed after ${MAX_RETRIES} attempts: ${err.message}`)
      process.exit(1)
    }

    const delay = BASE_DELAY_MS * Math.pow(2, attempt - 1)   // exponential backoff
    logger.warn(`MongoDB connection attempt ${attempt}/${MAX_RETRIES} failed. Retrying in ${delay}ms…`)
    await new Promise(r => setTimeout(r, delay))
    return connectDB(attempt + 1)
  }
}

// ── Graceful disconnect (called on SIGINT/SIGTERM) ──
export async function disconnectDB() {
  if (mongoose.connection.readyState === 0) return
  await mongoose.connection.close()
  logger.info('MongoDB connection closed gracefully')
}

// ── Health check helper ──
export function isConnected() {
  return mongoose.connection.readyState === 1
}

export default mongoose

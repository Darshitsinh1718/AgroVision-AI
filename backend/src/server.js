// src/server.js
// ─────────────────────────────────────────────────────────
// Application entry point.
// 1. Loads environment config (env.js validates + fails fast)
// 2. Connects to MongoDB (with retry)
// 3. Starts Express HTTP server
// 4. Registers graceful shutdown handlers (SIGTERM, SIGINT)
//
// Separation: app.js = Express config, server.js = process lifecycle
// This allows testing app.js without starting a real server.
// ─────────────────────────────────────────────────────────

import env              from './config/env.js'
import { connectDB, disconnectDB } from './config/database.js'
import logger           from './utils/logger.js'
import app              from './app.js'

let server

// ── Start sequence ────────────────────────────────────────
async function start() {
  try {
    // 1. Connect to MongoDB
    logger.info(`Connecting to MongoDB…`)
    await connectDB()

    // 2. Start HTTP server
    server = app.listen(env.PORT, () => {
      logger.info('─'.repeat(55))
      logger.info(`🌿  ${env.APP_NAME} API`)
      logger.info(`   Mode:    ${env.NODE_ENV}`)
      logger.info(`   Port:    ${env.PORT}`)
      logger.info(`   Version: /api/${env.API_VERSION}`)
      logger.info(`   Health:  http://localhost:${env.PORT}/api/${env.API_VERSION}/health`)
      logger.info('─'.repeat(55))
    })

    // Handle server-level errors (e.g. EADDRINUSE)
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        logger.error(`Port ${env.PORT} is already in use. Kill the process or change PORT in .env`)
      } else {
        logger.error(`Server error: ${err.message}`)
      }
      process.exit(1)
    })

  } catch (err) {
    logger.error(`Failed to start server: ${err.message}`)
    process.exit(1)
  }
}

// ── Graceful shutdown ─────────────────────────────────────
// Allows in-flight requests to complete before closing
async function shutdown(signal) {
  logger.info(`\n${signal} received — shutting down gracefully…`)

  if (!server) {
    await disconnectDB()
    process.exit(0)
  }

  server.close(async () => {
    logger.info('HTTP server closed — no more incoming connections')
    await disconnectDB()
    logger.info('Shutdown complete ✓')
    process.exit(0)
  })

  // Force exit after 10s if graceful shutdown hangs
  setTimeout(() => {
    logger.error('Forced shutdown after timeout')
    process.exit(1)
  }, 10_000)
}

// ── Signal handlers ───────────────────────────────────────
process.on('SIGTERM', () => shutdown('SIGTERM'))   // Docker stop / k8s scale down
process.on('SIGINT',  () => shutdown('SIGINT'))    // Ctrl+C in terminal

// ── Unhandled promise rejections ──────────────────────────
process.on('unhandledRejection', (reason) => {
  logger.error(`Unhandled Promise Rejection: ${reason}`)
  // In production, restart the process rather than let it run in an unknown state
  if (env.IS_PROD) shutdown('unhandledRejection')
})

// ── Uncaught exceptions ───────────────────────────────────
process.on('uncaughtException', (err) => {
  logger.error(`Uncaught Exception: ${err.message}`, { stack: err.stack })
  shutdown('uncaughtException')
})

// ── Boot ──────────────────────────────────────────────────
start()

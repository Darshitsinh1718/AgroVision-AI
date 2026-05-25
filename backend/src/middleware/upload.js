// src/middleware/upload.js
// ─────────────────────────────────────────────────────────
// Multer configuration for secure file uploads.
// Features:
//   • MIME type whitelist (JPEG, PNG, WEBP only)
//   • File size limit (from env)
//   • Unique filename with UUID
//   • Separate storage for images vs documents
//   • Memory storage option for ML pipe (no disk write)
// ─────────────────────────────────────────────────────────

import multer from 'multer'
import { resolve, dirname, extname } from 'path'
import { fileURLToPath } from 'url'
import { mkdirSync } from 'fs'
import { v4 as uuidv4 } from 'uuid'
import { ApiError } from '../utils/ApiError.js'
import env from '../config/env.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

// ── Allowed MIME types ───────────────────────────────────
const ALLOWED_IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif',
  'image/avif',
])


// ── MIME filter factory ──────────────────────────────────
function imageFilter(req, file, cb) {
  if (!ALLOWED_IMAGE_TYPES.has(file.mimetype)) {
    return cb(
      new ApiError(415, `Unsupported file type "${file.mimetype}". Only JPEG, PNG and WEBP are allowed.`),
      false
    )
  }
  cb(null, true)
}

// ── Disk storage — for images saved to server ────────────
function diskStorage(subfolder) {
  const uploadPath = resolve(__dirname, '../../', env.UPLOAD_DIR, subfolder)
  mkdirSync(uploadPath, { recursive: true })

  return multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadPath),
    filename:    (req, file, cb) => {
      const ext      = extname(file.originalname).toLowerCase()
      const filename = `${uuidv4()}${ext}`
      cb(null, filename)
    },
  })
}

// ── Memory storage — for ML pipeline (no temp files) ────
const memoryStorage = multer.memoryStorage()

// ── Limiter config ───────────────────────────────────────
const limits = {
  fileSize: env.MAX_FILE_SIZE_MB * 1024 * 1024,
  files:    1,   // One file per request
}

// ── Exported multer instances ────────────────────────────

/** Saves crop disease images to disk (uploads/crops/) */
export const cropImageUpload = multer({
  storage:    diskStorage('crops'),
  fileFilter: imageFilter,
  limits,
})

/** Keeps image in memory for direct forwarding to ML service */
export const cropImageMemory = multer({
  storage:    memoryStorage,
  fileFilter: imageFilter,
  limits,
})

/** Generic image upload to uploads/misc/ */
export const genericImageUpload = multer({
  storage:    diskStorage('misc'),
  fileFilter: imageFilter,
  limits,
})

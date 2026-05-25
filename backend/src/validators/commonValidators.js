// src/validators/commonValidators.js
// ─────────────────────────────────────────────────────────
// Reusable express-validator chains.
// Import and compose these in route files:
//   router.post('/', [...emailValidator, ...passwordValidator], validate, handler)
// ─────────────────────────────────────────────────────────

import { body, param, query } from 'express-validator'

// ── Auth ─────────────────────────────────────────────────
export const emailValidator = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Must be a valid email address')
    .normalizeEmail(),
]

export const passwordValidator = [
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
    .matches(/[0-9]/).withMessage('Password must contain at least one number'),
]

// ── Pagination ───────────────────────────────────────────
export const paginationValidator = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer')
    .toInt(),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
    .toInt(),
]

// ── MongoDB ObjectId ─────────────────────────────────────
export const mongoIdParam = (paramName = 'id') => [
  param(paramName)
    .isMongoId().withMessage(`"${paramName}" must be a valid MongoDB ObjectId`),
]

// ── Crop Recommendation inputs ────────────────────────────
export const cropRecommendValidator = [
  body('nitrogen')
    .notEmpty().withMessage('Nitrogen (N) is required')
    .isFloat({ min: 0, max: 500 }).withMessage('Nitrogen must be between 0 and 500 kg/ha')
    .toFloat(),
  body('phosphorus')
    .notEmpty().withMessage('Phosphorus (P) is required')
    .isFloat({ min: 0, max: 500 }).withMessage('Phosphorus must be between 0 and 500 kg/ha')
    .toFloat(),
  body('potassium')
    .notEmpty().withMessage('Potassium (K) is required')
    .isFloat({ min: 0, max: 500 }).withMessage('Potassium must be between 0 and 500 kg/ha')
    .toFloat(),
  body('temperature')
    .notEmpty().withMessage('Temperature is required')
    .isFloat({ min: -10, max: 60 }).withMessage('Temperature must be between -10°C and 60°C')
    .toFloat(),
  body('humidity')
    .notEmpty().withMessage('Humidity is required')
    .isFloat({ min: 0, max: 100 }).withMessage('Humidity must be between 0% and 100%')
    .toFloat(),
  body('ph')
    .notEmpty().withMessage('pH level is required')
    .isFloat({ min: 0, max: 14 }).withMessage('pH must be between 0 and 14')
    .toFloat(),
  body('rainfall')
    .notEmpty().withMessage('Rainfall is required')
    .isFloat({ min: 0, max: 5000 }).withMessage('Rainfall must be between 0 and 5000 mm')
    .toFloat(),
]

// ── Weather location ──────────────────────────────────────
export const weatherQueryValidator = [
  query('lat')
    .notEmpty().withMessage('Latitude is required')
    .isFloat({ min: -90, max: 90 }).withMessage('Latitude must be between -90 and 90')
    .toFloat(),
  query('lon')
    .notEmpty().withMessage('Longitude is required')
    .isFloat({ min: -180, max: 180 }).withMessage('Longitude must be between -180 and 180')
    .toFloat(),
]

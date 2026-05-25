// backend/src/controllers/authController.js
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import asyncHandler from '../utils/asyncHandler.js'
import env from '../config/env.js'

// ── Helpers ───────────────────────────────────────────────
const signToken = (payload) =>
  jwt.sign(payload, env.JWT_SECRET || process.env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN || '7d',
  })

const setAuthCookie = (res, token) => {
  const cookieOpts = {
    httpOnly: true,
    secure: env.IS_PROD,
    sameSite: 'lax',
  }

  try {
    const s = (env.JWT_EXPIRES_IN || '7d').toLowerCase()
    if (s.endsWith('d')) {
      const days = parseInt(s.slice(0, -1), 10) || 7
      cookieOpts.maxAge = days * 24 * 60 * 60 * 1000
    } else if (s.endsWith('h')) {
      const hrs = parseInt(s.slice(0, -1), 10) || 24
      cookieOpts.maxAge = hrs * 60 * 60 * 1000
    }
  } catch (e) {}

  res.cookie('agrovision_token', token, cookieOpts)
}

// ── Auth controllers ─────────────────────────────────────
export const register = asyncHandler(async (req, res) => {
  const {
    farmerName,
    email,
    password,
    phone,
    state,
    district,
    taluka,
    village,
    farmName,
    totalArea,
    areaUnit,
    soilType,
    primaryCrop,
    season,
    irrigationType,
  } = req.body

  if (!farmerName || !email || !password) {
    throw ApiError.badRequest('Name, email and password are required')
  }

  const existing = await User.findOne({ email: email.toLowerCase() })
  if (existing) throw ApiError.conflict('Email already registered')

  const user = await User.create({
    farmerName,
    name: farmerName,
    email: email.toLowerCase(),
    password,
    phone,
    state,
    district,
    taluka,
    village,
    farmName,
    totalArea,
    areaUnit,
    soilType,
    primaryCrop,
    season,
    irrigationType,
    role: 'farmer',
  })

  const token = signToken({ id: user._id })
  setAuthCookie(res, token)

  return res.status(201).json({
    success: true,
    message: 'Registered successfully',
    token,
    user: user.toSafeObject ? user.toSafeObject() : user,
  })
})

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    throw ApiError.badRequest('Email and password are required')
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select(
    '+password'
  )

  if (!user) throw ApiError.unauthorized('Invalid credentials')

  const isMatch = await user.comparePassword(password)
  if (!isMatch) throw ApiError.unauthorized('Invalid credentials')

  const token = signToken({ id: user._id })
  setAuthCookie(res, token)

  return res.status(200).json({
    success: true,
    message: 'Logged in successfully',
    token,
    user: user.toSafeObject ? user.toSafeObject() : user,
  })
})

export const getMe = asyncHandler(async (req, res) => {
  if (!req.user) throw ApiError.unauthorized()
  return ApiResponse.success(res, { data: req.user })
})

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie('agrovision_token', {
    httpOnly: true,
    secure: env.IS_PROD,
    sameSite: 'lax',
  })
  return ApiResponse.success(res, { message: 'Logged out' })
})

// ── Auth middleware exports ──────────────────────────────
export const authenticate = asyncHandler(async (req, res, next) => {
  const token =
    req.headers.authorization?.split(' ')[1] ||
    req.cookies?.agrovision_token ||
    req.cookies?.token ||
    req.cookies?.accessToken

  if (!token) throw ApiError.unauthorized('Authentication required')

  const decoded = jwt.verify(token, env.JWT_SECRET || process.env.JWT_SECRET)
  const user = await User.findById(decoded.id).select('-password')

  if (!user) throw ApiError.unauthorized('User no longer exists')

  req.user = user
  next()
})

export const protect = authenticate

export const optionalAuth = asyncHandler(async (req, res, next) => {
  const token =
    req.headers.authorization?.split(' ')[1] ||
    req.cookies?.agrovision_token ||
    req.cookies?.token ||
    req.cookies?.accessToken

  if (!token) return next()

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET || process.env.JWT_SECRET)
    const user = await User.findById(decoded.id).select('-password')
    if (user) req.user = user
  } catch {}
  next()
})

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) throw ApiError.unauthorized('Authentication required')
    if (!roles.includes(req.user.role))
      throw ApiError.forbidden('You are not allowed to access this resource')
    next()
  }
}

export default {
  authenticate,
  protect,
  optionalAuth,
  authorize,
  register,
  login,
  getMe,
  logout,
}
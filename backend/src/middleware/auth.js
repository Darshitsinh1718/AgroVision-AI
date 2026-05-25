import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import { ApiError } from '../utils/ApiError.js'
import asyncHandler from '../utils/asyncHandler.js'
import env from '../config/env.js'

const getTokenFromRequest = (req) => {
  let token = null

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1]
  }

  if (!token && req.cookies?.token) {
    token = req.cookies.token
  }

  if (!token && req.cookies?.accessToken) {
    token = req.cookies.accessToken
  }

  return token
}

export const authenticate = asyncHandler(async (req, res, next) => {
  const token = getTokenFromRequest(req)

  if (!token) {
    throw ApiError.unauthorized('Authentication required')
  }

  const decoded = jwt.verify(
    token,
    env.JWT_SECRET || process.env.JWT_SECRET
  )

  const user = await User.findById(decoded.id).select('-password')

  if (!user) {
    throw ApiError.unauthorized('User no longer exists')
  }

  req.user = user
  next()
})

export const protect = authenticate

export const optionalAuth = asyncHandler(async (req, res, next) => {
  const token = getTokenFromRequest(req)

  if (!token) {
    return next()
  }

  try {
    const decoded = jwt.verify(
      token,
      env.JWT_SECRET || process.env.JWT_SECRET
    )

    const user = await User.findById(decoded.id).select('-password')

    if (user) {
      req.user = user
    }
  } catch {
    // ignore invalid token for optional auth
  }

  next()
})

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      throw ApiError.unauthorized('Authentication required')
    }

    if (!roles.includes(req.user.role)) {
      throw ApiError.forbidden('You are not allowed to access this resource')
    }

    next()
  }
}

export default {
  authenticate,
  protect,
  optionalAuth,
  authorize,
}
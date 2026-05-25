import User from '../models/User.js'
import { ApiError } from '../utils/ApiError.js'
import asyncHandler from '../utils/asyncHandler.js'

const sanitizeUser = (user) => {
  const obj = user.toObject ? user.toObject() : user
  delete obj.password
  delete obj.refreshToken
  delete obj.__v
  return obj
}

// GET /api/v1/users/profile
export const getProfile = asyncHandler(async (req, res) => {
  const userId = req.user?._id || req.user?.id

  if (!userId) {
    throw ApiError.unauthorized('Authentication required')
  }

  const user = await User.findById(userId).select('-password')

  if (!user) {
    throw ApiError.notFound('User not found')
  }

  return res.status(200).json({
    success: true,
    user: sanitizeUser(user),
  })
})

// PATCH /api/v1/users/profile
export const updateProfile = asyncHandler(async (req, res) => {
  const userId = req.user?._id || req.user?.id

  if (!userId) {
    throw ApiError.unauthorized('Authentication required')
  }

  const allowedFields = [
    'farmerName',
    'name',
    'phone',
    'state',
    'district',
    'taluka',
    'village',
    'nearestMarketYard',
    'farmName',
    'totalArea',
    'areaUnit',
    'primaryCrop',
    'soilType',
    'irrigationType',
    'season',
    'language',
    'notificationPreference',
    'preferredUnits',
  ]

  const updates = {}

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field]
    }
  })

  if (updates.farmerName && !updates.name) {
    updates.name = updates.farmerName
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { $set: updates },
    {
      new: true,
      runValidators: true,
    }
  ).select('-password')

  if (!user) {
    throw ApiError.notFound('User not found')
  }

  return res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    user: sanitizeUser(user),
  })
})

// GET /api/v1/users/dashboard-summary
export const getDashboardSummary = asyncHandler(async (req, res) => {
  const userId = req.user?._id || req.user?.id

  if (!userId) {
    throw ApiError.unauthorized('Authentication required')
  }

  const user = await User.findById(userId).select('-password')

  if (!user) {
    throw ApiError.notFound('User not found')
  }

  const profileFields = [
    'farmerName',
    'phone',
    'state',
    'district',
    'taluka',
    'village',
    'farmName',
    'totalArea',
    'primaryCrop',
    'soilType',
    'irrigationType',
    'season',
  ]

  const completedFields = profileFields.filter((field) => {
    return user[field] !== undefined && user[field] !== null && user[field] !== ''
  })

  const profileCompletion = Math.round(
    (completedFields.length / profileFields.length) * 100
  )

  return res.status(200).json({
    success: true,
    data: {
      farmerName: user.farmerName || user.name || 'Farmer',
      email: user.email,
      phone: user.phone || '',
      location: {
        state: user.state || '',
        district: user.district || '',
        taluka: user.taluka || '',
        village: user.village || '',
        nearestMarketYard: user.nearestMarketYard || '',
      },
      farm: {
        farmName: user.farmName || '',
        totalArea: user.totalArea || '',
        areaUnit: user.areaUnit || '',
        primaryCrop: user.primaryCrop || '',
        soilType: user.soilType || '',
        irrigationType: user.irrigationType || '',
        season: user.season || '',
      },
      preferences: {
        language: user.language || 'English',
        notificationPreference:
          user.notificationPreference || 'Important alerts only',
        preferredUnits: user.preferredUnits || 'metric',
      },
      profileCompletion,
    },
  })
})

export default {
  getProfile,
  updateProfile,
  getDashboardSummary,
}
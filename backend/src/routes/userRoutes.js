import { Router } from 'express'
import {
  getProfile,
  updateProfile,
  getDashboardSummary,
} from '../controllers/userController.js'
import { authenticate } from '../middleware/auth.js'

const router = Router()

router.get('/profile', authenticate, getProfile)
router.patch('/profile', authenticate, updateProfile)
router.get('/dashboard-summary', authenticate, getDashboardSummary)

export default router
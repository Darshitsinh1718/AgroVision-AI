import express from 'express';
import { register, login, getMe, logout } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes (JWT required)
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);

export default router;

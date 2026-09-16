import express from 'express';
import { registerUser, loginUser, logoutUser, refreshAccessToken, getUserProfile } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/refresh', refreshAccessToken);
router.post('/logout', logoutUser);
router.get('/profile', protect, getUserProfile);

export default router;

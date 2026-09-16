import express from 'express';
import jwt from 'jsonwebtoken';
import { ACCESS_COOKIE, REFRESH_COOKIE } from '../utils/generateToken.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Decode JWT without verification (dev only)
const decode = (token) => {
  try {
    return jwt.decode(token) || {};
  } catch (error) {
    return {};
  }
};

if (process.env.NODE_ENV !== 'production') {
  router.get('/tokens', protect, (req, res) => {
    const access = decode(req.cookies?.[ACCESS_COOKIE] || '');
    const refresh = decode(req.cookies?.[REFRESH_COOKIE] || '');
    res.json({ access, refresh });
  });
}

export default router;

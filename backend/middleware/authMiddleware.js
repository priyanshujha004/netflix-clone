import jwt from 'jsonwebtoken';
import { ACCESS_COOKIE, verifyAccessToken } from '../utils/generateToken.js';

export const protect = async (req, res, next) => {
    const token = req.cookies[ACCESS_COOKIE];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const decoded = verifyAccessToken(token);
        if (decoded.type !== 'access' || !decoded.sub) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        req.user = { _id: decoded.sub };
        return next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ message: 'Access token expired' });
        }
        return res.status(401).json({ message: 'Unauthorized' });
    }
};

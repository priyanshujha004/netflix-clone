import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import RefreshSession from '../models/RefreshSession.js';
import {
    REFRESH_COOKIE,
    clearAuthCookies,
    createAccessToken,
    createRefreshToken,
    setAuthCookies,
    verifyRefreshToken,
} from '../utils/generateToken.js';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const safeUser = (user) => ({ _id: user._id, name: user.name, email: user.email });
const normalizeEmail = (email) => typeof email === 'string' ? email.trim().toLowerCase() : '';

const validRegistration = (name, email, password) => (
    Boolean(name?.trim()) && emailPattern.test(email) && typeof password === 'string' && password.length >= 8
);

const createSessionAndCookies = async (res, user, userAgent, familyId) => {
    const accessToken = createAccessToken(user._id);
    const refresh = createRefreshToken(user._id, familyId);

    await RefreshSession.create({
        userId: user._id,
        jti: refresh.jti,
        familyId: refresh.familyId,
        expiresAt: refresh.expiresAt,
        userAgent,
    });
    setAuthCookies(res, accessToken, refresh.token);
    return refresh;
};

const revokeFamily = async (familyId) => {
    if (familyId) {
        await RefreshSession.updateMany(
            { familyId, revokedAt: null },
            { $set: { revokedAt: new Date() } },
        );
    }
};

export const registerUser = async (req, res) => {
    const { name, password } = req.body;
    const email = normalizeEmail(req.body.email);

    if (!validRegistration(name, email, password)) {
        return res.status(400).json({ message: 'Provide a name, valid email, and password of at least 8 characters' });
    }

    try {
        const user = await User.create({ name: name.trim(), email, password });
        return res.status(201).json({ message: 'User registered successfully', user: safeUser(user) });
    } catch (error) {
        if (error?.code === 11000) {
            return res.status(400).json({ message: 'User already exists' });
        }
        if (error?.name === 'ValidationError') {
            return res.status(400).json({ message: 'Invalid user data' });
        }
        console.error('Registration failed:', error.message);
        return res.status(500).json({ message: 'Unable to register user' });
    }
};

export const loginUser = async (req, res) => {
    const email = normalizeEmail(req.body.email);
    const { password } = req.body;

    if (!email || typeof password !== 'string') {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // The application deliberately permits one active session per account.
        await RefreshSession.updateMany(
            { userId: user._id, revokedAt: null },
            { $set: { revokedAt: new Date() } },
        );
        await createSessionAndCookies(res, user, req.get('user-agent'));
        return res.status(200).json({ message: 'Login Successful', user: safeUser(user) });
    } catch (error) {
        console.error('Login failed:', error.message);
        return res.status(500).json({ message: 'Unable to log in' });
    }
};

export const refreshAccessToken = async (req, res) => {
    const token = req.cookies[REFRESH_COOKIE];
    console.log('🔍 Refresh endpoint hit – cookie token present?', !!token);
    if (!token) {
        console.log('❌ No refresh token cookie');
        clearAuthCookies(res);
        return res.status(401).json({ message: 'Unauthorized' });
    }

    let decoded;
    try {
        decoded = verifyRefreshToken(token);
        console.log('✅ Refresh token verified, payload:', decoded);
    } catch (err) {
        console.error('⚠️ Refresh token verification failed:', err.message);
        clearAuthCookies(res);
        return res.status(401).json({ message: 'Unauthorized' });
    }


    if (decoded.type !== 'refresh' || !decoded.sub || !decoded.jti || !decoded.familyId) {
        clearAuthCookies(res);
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const session = await RefreshSession.findOne({ jti: decoded.jti, userId: decoded.sub });
        if (!session || session.expiresAt <= new Date() || session.revokedAt) {
            await revokeFamily(decoded.familyId);
            clearAuthCookies(res);
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const revoked = await RefreshSession.findOneAndUpdate(
            { _id: session._id, revokedAt: null },
            { $set: { revokedAt: new Date() } },
            { new: true },
        );
        if (!revoked) {
            await revokeFamily(decoded.familyId);
            clearAuthCookies(res);
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const user = await User.findById(decoded.sub);
        if (!user) {
            await revokeFamily(decoded.familyId);
            clearAuthCookies(res);
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const replacement = await createSessionAndCookies(res, user, req.get('user-agent'), decoded.familyId);
        await RefreshSession.updateOne({ _id: session._id }, { $set: { replacedBy: replacement.jti } });
        return res.status(200).json({ message: 'Session refreshed' });
    } catch (error) {
        console.error('Token refresh failed:', error.message);
        clearAuthCookies(res);
        return res.status(500).json({ message: 'Unable to refresh session' });
    }
};

export const logoutUser = async (req, res) => {
    const token = req.cookies[REFRESH_COOKIE];

    if (token) {
        let jti;
        try {
            const decoded = verifyRefreshToken(token);
            jti = decoded?.jti;
        } catch {
            // A decoded expired token can still identify a server-side session to revoke.
            jti = jwt.decode(token)?.jti;
        }

        if (jti) {
            try {
                await RefreshSession.updateOne(
                    { jti, revokedAt: null },
                    { $set: { revokedAt: new Date() } },
                );
            } catch (error) {
                console.error('Logout session revocation failed:', error.message);
            }
        }
    }

    clearAuthCookies(res);
    return res.status(200).json({ message: 'Logged out successfully' });
};

export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json(safeUser(user));
    } catch (error) {
        console.error('Profile lookup failed:', error.message);
        return res.status(500).json({ message: 'Unable to load profile' });
    }
};

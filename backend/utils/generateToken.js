import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';

export const ACCESS_COOKIE = 'accessToken';
export const REFRESH_COOKIE = 'refreshToken';

const accessSecret = () => process.env.ACCESS_TOKEN_SECRET || process.env.JWT_SECRET;
const refreshSecret = () => process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET;
const accessTtl = () => process.env.ACCESS_TOKEN_TTL || '15m';
const refreshTtl = () => process.env.REFRESH_TOKEN_TTL || '7d';

const cookieBase = () => ({
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.COOKIE_SAME_SITE,
    path: '/',
});


const tokenExpiry = (token) => new Date(jwt.decode(token).exp * 1000);

export const createAccessToken = (userId) => jwt.sign(
    { type: 'access' },
    accessSecret(),
    { subject: userId.toString(), issuer: 'netflix-clone', audience: 'netflix-clone-api', expiresIn: accessTtl() },
);

export const createRefreshToken = (userId, familyId = randomUUID()) => {
    const jti = randomUUID();
    const token = jwt.sign(
        { type: 'refresh', familyId },
        refreshSecret(),
        { subject: userId.toString(), jwtid: jti, issuer: 'netflix-clone', audience: 'netflix-clone-api', expiresIn: refreshTtl() },
    );

    return { token, jti, familyId, expiresAt: tokenExpiry(token) };
};

export const verifyAccessToken = (token) => jwt.verify(token, accessSecret(), {
    issuer: 'netflix-clone', audience: 'netflix-clone-api',
});

export const verifyRefreshToken = (token) => jwt.verify(token, refreshSecret(), {
    issuer: 'netflix-clone', audience: 'netflix-clone-api',
});

export const setAuthCookies = (res, accessToken, refreshToken) => {
    res.cookie(ACCESS_COOKIE, accessToken, { ...cookieBase(), maxAge: tokenExpiry(accessToken).getTime() - Date.now() });
    res.cookie(REFRESH_COOKIE, refreshToken, { ...cookieBase(), maxAge: tokenExpiry(refreshToken).getTime() - Date.now() });
};

export const clearAuthCookies = (res) => {
    res.clearCookie(ACCESS_COOKIE, cookieBase());
    res.clearCookie(REFRESH_COOKIE, cookieBase());
};

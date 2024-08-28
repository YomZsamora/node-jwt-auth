const jwt = require('jsonwebtoken');
const { JWT_SECRET_KEY } = process.env;
const uuid = require('uuid');
const RefreshToken = require('../models/authentication/refresh-token');

const generateAccessToken = async (user) => {
    
    payload = {
        userId: user.id,
        email: user.email,
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24), // 1 day expiration
    }
    return jwt.sign(payload, JWT_SECRET_KEY, { algorithm: 'HS256' });
}

const generateRefreshToken = async (user) => {

    const jti = uuid.v4();
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 2);

    const payload = {
        jti,
        exp: Math.floor(expiryDate.getTime() / 1000),
        iat: Math.floor(Date.now() / 1000),
    };

    await RefreshToken.create({
        jti,
        userId: user.id,
        expiryDate
    });

    return jwt.sign(payload, JWT_SECRET_KEY, { algorithm: 'HS256' });
};

module.exports = { generateAccessToken, generateRefreshToken }
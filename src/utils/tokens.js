const jwt = require('jsonwebtoken');
const { JWT_SECRET_KEY } = process.env;
const uuid = require('uuid');
const RefreshToken = require('../models/authentication/refresh-token');
const { getUserPermissions } = require('./user-helpers')
const { ValidationError, NotAuthenticated } = require('./exceptions/custom-exceptions')

/**
* Generates an access token for a given user with specified permissions.
* @param {object} user - User object containing user information.
* @returns {string} Access token signed with JWT.
*/
const generateAccessToken = async (user) => {
    
    const permissions = await getUserPermissions(user.id);
    payload = {
        userId: user.id,
        email: user.email,
        permissions,
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24), // 1 day expiration
    }
    return jwt.sign(payload, JWT_SECRET_KEY, { algorithm: 'HS256' });
}

/**
* Generates a refresh token for a given user.
* @param {object} user - User object containing user information.
* @returns {string} Refresh token signed with JWT.
*/
const generateRefreshToken = async (user) => {

    // Generate a unique JWT ID and expiry date
    const jti = uuid.v4();
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 2);

    const payload = {
        jti,
        exp: Math.floor(expiryDate.getTime() / 1000),
        iat: Math.floor(Date.now() / 1000),
    };

    // Create a new refresh token entry in the database
    await RefreshToken.create({
        jti,
        userId: user.id,
        expiryDate
    });

    return jwt.sign(payload, JWT_SECRET_KEY, { algorithm: 'HS256' });
};

/**
* Extracts and verifies the payload of a JWT token.
*
* @param {string} token - The JWT token to extract and verify.
* @returns {object} - The payload extracted from the JWT token.
* @throws {ValidationError} - Thrown when the token is invalid or expired.
*/
const extractTokenPayload = (token) => {
    try {
        token_payload = jwt.verify(token, JWT_SECRET_KEY, { algorithms: ['HS256'] });
        return token_payload;
    } catch (error) {
        throw new NotAuthenticated('Invalid or expired refresh token.');
    }
}

module.exports = { generateAccessToken, generateRefreshToken, extractTokenPayload }

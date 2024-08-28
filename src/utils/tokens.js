const jwt = require('jsonwebtoken');
const { JWT_SECRET_KEY } = process.env;

const generateAccessToken = async (user) => {
    
    payload = {
        userId: user.id,
        email: user.email,
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24), // 1 day expiration
    }
    return jwt.sign(payload, JWT_SECRET_KEY, { algorithm: 'HS256' });
}

module.exports = { generateAccessToken }
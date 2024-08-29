const { check, validationResult } = require('express-validator');
const { ValidationError, NotAuthenticated, PermissionDenied } = require('../utils/exceptions/custom-exceptions');
const jwt = require('jsonwebtoken');
const RefreshToken = require('../models/authentication/refresh-token');
const { JWT_SECRET_KEY } = process.env;
const User = require('../models/authentication/user');

const validateLogin = [
    check('email').isEmail().withMessage('Valid email address is required.').bail(),
    check('password').not().isEmpty().withMessage('Password is required.').bail(),
    (req, res, next) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            const validationErrors = errors.array().map(err => ({ [err.path]: err.msg }));
            throw new ValidationError('An error occured while logging in.', validationErrors);
        }
        next();
    }
];

const validateRefreshToken = [

    check('refreshToken').not().isEmpty().withMessage('Refresh token is required.').bail(),
    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            const validationErrors = errors.array().map(err => ({ [err.path]: err.msg }));
            if (!errors.isEmpty()) throw new ValidationError('An error occurred refreshing token.', validationErrors);
            
            const { refreshToken } = req.body;
            const token_payload = jwt.verify(refreshToken, JWT_SECRET_KEY, { algorithms: ['HS256'] });
            const storedRefreshToken = await RefreshToken.findOne({ where: { jti: token_payload.jti } });
            if (!storedRefreshToken) throw new ValidationError('Invalid refresh token.');
            if (new Date(storedRefreshToken.expiryDate) < new Date()) throw new ValidationError('Refresh token has expired.');
            
            const user = await User.findByPk(storedRefreshToken.userId);
            req.user = user;
            next();
        } catch(error) {
            next(error);
        }
    }
];

const isUserAuthenticated = (req, res, next) => {
    
    if (req.method === "OPTIONS") {
        next();
    }
    try {
        const authorizationHeader = req.headers('authorization');
        if (!authorizationHeader) throw new NotAuthenticated();
        const token = authorizationHeader.replace("Bearer ", "").trim();
        const token_payload = jwt.verify(token, JWT_SECRET_KEY, { algorithms: ['HS256'] });
        req.currentUser = {
            userId: token_payload.userId,
            email: token_payload.email,
            permissions: token_payload.permissions
        };
        next();
    } catch (error) {
        return next(error);
    }
}

const hasAnyPermission = (requiredPermissions) => {
    return async (req, res, next) => {
        await isUserAuthenticated(req, res, async (error) => {
            if (error instanceof NotAuthenticated) return next(error);
            const userPermissions = req.currentUser.permissions;
            if (requiredPermissions.some(perm => userPermissions.includes(perm))) {
                return next();
            }
            return next(new PermissionDenied());
        });
    };
}

const hasAllPermissions = (requiredPermissions) => {
    return async (req, res, next) => {
        await isUserAuthenticated(req, res, async (error) => {
            if (error instanceof NotAuthenticated) return next(error);
            const userPermissions = req.currentUser.permissions;
            if (requiredPermissions.every(perm => userPermissions.includes(perm))) {
                return next();
            }
            return next(new PermissionDenied());
        });
    };
}

module.exports = { validateLogin, validateRefreshToken, isUserAuthenticated, hasAnyPermission, hasAllPermissions };
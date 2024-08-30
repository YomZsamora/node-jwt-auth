const jwt = require('jsonwebtoken');
const { JWT_SECRET_KEY } = process.env;
const { extractTokenPayload } = require('../utils/tokens');
const User = require('../models/authentication/user');
const { check, validationResult } = require('express-validator');
const RefreshToken = require('../models/authentication/refresh-token');
const { ValidationError, NotAuthenticated, PermissionDenied } = require('../utils/exceptions/custom-exceptions');
const { emailValidator, firstNameValidator, lastNameValidator, passwordValidator, passwordConfirmationValidator } = require('../utils/validators/auth-validators');

/**
* Middleware for validating login request parameters.
* @function validateLogin
*/
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

/**
* Middleware for validating refresh token in a request.
* @function validateRefreshToken
*/
const validateRefreshToken = [

    check('refreshToken').not().isEmpty().withMessage('Refresh token is required.').bail(),
    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            const validationErrors = errors.array().map(err => ({ [err.path]: err.msg }));
            if (!errors.isEmpty()) throw new ValidationError('An error occurred refreshing token.', validationErrors);
            
            const { refreshToken } = req.body;
            const token_payload = extractTokenPayload(refreshToken);
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

/**
* Middleware for checking if user is authenticated based on JWT.
* @function isUserAuthenticated
*/
const isUserAuthenticated = (req, res, next) => {
    
    if (req.method === "OPTIONS") {
        next();
    }
    try {
        const authorizationHeader = req.headers['authorization'];
        if (!authorizationHeader) throw new NotAuthenticated();
        const token = authorizationHeader.replace("Bearer ", "").trim();
        const token_payload = extractTokenPayload(token);
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

/**
* Middleware to check if user has any of the required permissions.
* @function hasAnyPermission
* @param {Array} requiredPermissions - List of required permissions.
*/
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

/**
 * Middleware to check if user has all the required permissions.
 * @function hasAllPermissions
 * @param {Array} requiredPermissions - List of required permissions.
 */
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

/**
* Express middleware function for validating user registration data.
* It includes validators for email, first name, last name, password, and password confirmation.
* If validation fails, it throws a custom ValidationError with detailed error messages.
* 
* @middleware
* @constant {Array} validateUserRegistration - Array of validation functions to be executed as middleware
* @constant {Function} emailValidator - Validator function for email field
* @constant {Function} firstNameValidator - Validator function for first name field
* @constant {Function} lastNameValidator - Validator function for last name field
* @constant {Function} passwordValidator - Validator function for password field
* @constant {Function} passwordConfirmationValidator - Validator function for password confirmation field
* 
* @param {Object} req - Express request object
* @param {Object} res - Express response object
* @param {Function} next - Express next middleware function
*/
const validateUserRegistration = [
    
    emailValidator,
    firstNameValidator,
    lastNameValidator,
    passwordValidator,
    passwordConfirmationValidator,
    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            const validationErrors = errors.array().map(err => ({ [err.path]: err.msg }));
            if (!errors.isEmpty()) throw new ValidationError('An error occurred during registration.', validationErrors);
            next();
        } catch(error) {
            next(error);
        }
    }
];

module.exports = { 
    validateLogin, 
    validateRefreshToken, 
    isUserAuthenticated, 
    hasAnyPermission, 
    hasAllPermissions,
    validateUserRegistration
};

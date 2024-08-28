const { check, validationResult } = require('express-validator');
const { ValidationError } = require('../utils/exceptions/custom-exceptions');

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

module.exports = { validateLogin };
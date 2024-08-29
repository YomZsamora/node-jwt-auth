/**
* Validators for user registration fields using express-validator.
* These validators ensure the correctness and validation of user input data.
*
* @module authValidators
*/

const { body } = require('express-validator');
const User = require('../../models/authentication/user');
const { ValidationError } = require('../exceptions/custom-exceptions');

const emailValidator = body('email')
    .isEmail().withMessage('Valid email address is required.')
    .not().isEmpty().withMessage('Email is required.')
    .custom(async (value) => {
        const user = await User.findOne({ where: { email: value } });
        if (user) {
            return Promise.reject(`${value} already exists. Please use a different email.`);
        }
    });

const firstNameValidator = body('firstName')
    .exists().withMessage('First name is required.')
    .not().isEmpty().withMessage('First name cannot be empty.');

const lastNameValidator = body('lastName')
    .exists().withMessage('Last name is required.')
    .not().isEmpty().withMessage('Last name cannot be empty.');

const passwordValidator = body('password')
    .not().isEmpty().withMessage('Password is required.')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.')
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/)
    .withMessage('Password must contain at least one digit, one lowercase letter, and one uppercase letter.');

const passwordConfirmationValidator = body('passwordConfirm')
    .not().isEmpty().withMessage('Password confirmation is required.')
    .custom((value, { req }) => {
        if (value !== req.body.password) throw new ValidationError('Passwords do not match.');
        return true;
    });
    

module.exports = {
    emailValidator,
    firstNameValidator,
    lastNameValidator,
    passwordValidator,
    passwordConfirmationValidator
}
/**
* Controller function for handling basic login functionality.
*
* This function retrieves the user's email and password from the request body,
* attempts to find a user with that email in the database, validates the provided password,
* updates the user's last login timestamp, generates access and refresh tokens upon successful login,
* and constructs an API response with user information and tokens before sending it back.
*
* @param {object} req - Express request object containing user input data.
* @param {object} res - Express response object for sending responses.
* @param {function} next - Express next function for passing errors to the error handler.
*
* @returns {Promise<void>} - A Promise that resolves once the response is sent or passes errors to the error handler.
*/

const User = require('../../models/authentication/user');
const { ApiResponse } = require('../../utils/responses');
const { ValidationError } = require('../../utils/exceptions/custom-exceptions');
const { generateAccessToken, generateRefreshToken } = require('../../utils/tokens');

const basicLoginController = async (req, res, next) => {

    try {

        const { email, password } = req.body;
        const user = await User.findOne({ where: {email} });
        if (!user) throw new ValidationError(`${email} does not exist.`);

        const isValidPassword = await user.isValidPassword(password);
        if (!isValidPassword) throw new ValidationError('Invalid email and/or password.');

        user.lastLogin = new Date();
        user.save()

        const accessToken = await generateAccessToken(user);
        const refreshToken = await generateRefreshToken(user);

        const apiResponse = new ApiResponse();
        apiResponse.message = "Logged in successfully.";
        apiResponse.data = {
            userId: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            lastLogin: user.lastLogin,
            accessToken,
            refreshToken
        }
        return res.status(apiResponse.code).json(apiResponse);
    } catch(error) {
        next(error);
    }
}

module.exports = { basicLoginController };

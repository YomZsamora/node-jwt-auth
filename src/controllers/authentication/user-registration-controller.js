/**
* Controller function for handling user registration.
* @param {Object} req - Express request object containing user registration details in req.body.
* @param {Object} res - Express response object to send back the API response.
* @param {Function} next - Express next function to pass control to the next middleware.
* @returns {Object} JSON response indicating the outcome of the user registration process.
*/

const User = require('../../models/authentication/user');
const { ApiResponse } = require('../../utils/responses');

const userRegistrationController = async (req, res, next) => {

    try {
        const { email, firstName, lastName, password } = req.body;
        const user = await User.create({ email, firstName, lastName, password });
        const apiResponse = new ApiResponse();
        apiResponse.message = `${email} has been successfully registered.`;
        apiResponse.data = {
            userId: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            lastLogin: user.lastLogin,
            updatedAt: user.updatedAt,
            createdAt: user.createdAt,
        }
        return res.status(apiResponse.code).json(apiResponse);
    } catch (error) {
        next(error);
    }
}

module.exports = { userRegistrationController };
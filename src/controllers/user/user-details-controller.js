/**
* Controller function to fetch user details by user ID.
* @param {Object} req - The request object.
* @param {Object} res - The response object.
* @param {Function} next - The next middleware function.
* @returns {Object} JSON response containing user details or an error message.
*/

const User = require('../../models/authentication/user');
const { ApiResponse } = require('../../utils/responses');
const { NotFound } = require('../../utils/exceptions/custom-exceptions');

const userDetailsController = async (req, res, next) => {

    try {
        const { userId } = req.params;
        const user = await User.findByPk(userId);
        if (!user) throw new NotFound("The requested 'User' does not exist.");

        const apiResponse = new ApiResponse();
        apiResponse.message = "User details retrieved successfully."
        apiResponse.data = {
            userId: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            lastLogin: user.lastLogin
        }
        return res.status(apiResponse.code).json(apiResponse);
    } catch (error) {
        next(error);
    }
}

module.exports = { userDetailsController };

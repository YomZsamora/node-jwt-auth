const User = require('../../models/authentication/user');
const { NotFound } = require('../../utils/exceptions/custom-exceptions');
const { ApiResponse } = require('../../utils/responses');

const fetchUserController = async (req, res, next) => {

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

module.exports = { fetchUserController };
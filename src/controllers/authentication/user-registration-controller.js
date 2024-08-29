const User = require('../../models/authentication/user');
const { ApiResponse } = require('../../utils/responses');

const userRegistrationController = async (req, res, next) => {
    
    try {
        const { email, firstName, lastName, password } = req.body;
        const user = User.create({ email, firstName, lastName, password });
        const apiResponse = new ApiResponse();
        apiResponse.message = `${email} has been successfully registered.`;
        apiResponse.data = {
            userId: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            lastLogin: user.lastLogin,
        }
        res.status(apiResponse.code).json(apiResponse);
    } catch (error) {
        next(error);
    }
}

module.exports = { userRegistrationController };
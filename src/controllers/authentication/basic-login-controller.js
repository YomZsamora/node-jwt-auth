const User = require('../../models/authentication/user');
const { ValidationError } = require('../../utils/exceptions/custom-exceptions');
const { ApiResponse } = require('../../utils/responses');
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
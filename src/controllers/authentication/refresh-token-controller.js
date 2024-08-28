const { ApiResponse } = require('../../utils/responses');
const { generateAccessToken, generateRefreshToken } = require('../../utils/tokens');

const refreshTokenController = async (req, res, next) => {

    try {
        const user = req.user;
        const accessToken = await generateAccessToken(user);
        const refreshToken = await generateRefreshToken(user);
        const apiResponse = new ApiResponse();
        apiResponse.message = "Token refreshed successfully.";
        apiResponse.data = {
            userId: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            lastLogin: user.lastLogin,
            accessToken,
            refreshToken
        };
        return res.status(apiResponse.code).json(apiResponse);

    } catch (error) {
        next(error);
    }
}

module.exports = { refreshTokenController };
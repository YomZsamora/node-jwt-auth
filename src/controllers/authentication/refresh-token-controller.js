/**
* Controller function to handle token refresh for a user.
*
* This controller generates a new access token and refresh token for the provided user,
* updates the user's last login timestamp, and returns the refreshed tokens along with user details.
*
* @param {Object} req - Express request object containing user information.
* @param {Object} res - Express response object used to send the API response.
* @param {Function} next - Express middleware callback function to pass control to the next handler.
* @returns {Object} JSON response indicating successful token refresh or error.
*/

const { ApiResponse } = require('../../utils/responses');
const { generateAccessToken, generateRefreshToken } = require('../../utils/tokens');

const refreshTokenController = async (req, res) => {

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
}

module.exports = { refreshTokenController };

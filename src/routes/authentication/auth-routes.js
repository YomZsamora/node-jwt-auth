const express = require('express');
const { basicLoginController } = require('../../controllers/authentication/basic-login-controller');
const { refreshTokenController } = require('../../controllers/authentication/refresh-token-controller');
const { userRegistrationController } = require('../../controllers/authentication/user-registration-controller');
const { validateLogin, validateRefreshToken, validateUserRegistration } = require('../../middlewares/authentication-middlewares');

const router = express.Router();

router.post('/basic-login', validateLogin, basicLoginController);
router.post('/refresh-token', validateRefreshToken, refreshTokenController);
router.post('/user-registration', validateUserRegistration, userRegistrationController);

module.exports = router;
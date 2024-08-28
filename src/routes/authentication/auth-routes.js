const express = require('express');
const { basicLoginController } = require('../../controllers/authentication/basic-login-controller');
const { refreshTokenController } = require('../../controllers/authentication/refresh-token-controller');
const { validateLogin, validateRefreshToken } = require('../../middlewares/authentication-middlewares');

const router = express.Router();

router.post('/basic-login', validateLogin, basicLoginController);
router.post('/refresh-token', validateRefreshToken, refreshTokenController);

module.exports = router;
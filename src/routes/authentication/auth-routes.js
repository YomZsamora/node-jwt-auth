const express = require('express');
const { basicLoginController } = require('../../controllers/authentication/basic-login-controller');
const { validateLogin } = require('../../middlewares/authentication-middlewares');

const router = express.Router();

router.post('/basic-login', validateLogin, basicLoginController);

module.exports = router;
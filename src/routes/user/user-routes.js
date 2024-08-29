const express = require('express');
const { fetchUserController } = require('../../controllers/user/fetch-user-controller');
const { hasAnyPermission } = require('../../middlewares/authentication-middlewares');

const router = express.Router();

router.get('/:userId/details', hasAnyPermission(['view_user']), fetchUserController);

module.exports = router;
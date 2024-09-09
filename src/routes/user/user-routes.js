const express = require('express');
const { userDetailsController } = require('../../controllers/user/user-details-controller');
const { hasAnyPermission } = require('../../middlewares/authentication-middlewares');

const router = express.Router();

router.get('/:userId/details', hasAnyPermission(['view_user']), userDetailsController);

module.exports = router;
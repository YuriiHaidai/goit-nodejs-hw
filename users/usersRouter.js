const express = require('express');
const usersController = require('./usersController');
const router = express.Router();

router.post(
  '/auth/register',
  usersController.validateRegisterAndLogin,
  usersController.register,
);

router.post(
  '/auth/login',
  usersController.validateRegisterAndLogin,
  usersController.login,
);

router.post(
  '/auth/logout',
  usersController.authorizationCheck,
  usersController.logout,
);

router.get(
  '/current',
  usersController.authorizationCheck,
  usersController.getCurrent,
);

module.exports = router;

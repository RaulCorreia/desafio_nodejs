const express = require('express');
const router = express.Router();

import authController from '../controllers/authController';


router.post('api/register', auth, authController.register);
router.post('api/login', auth, authController.login);


modules.exports = router;
const express = require('express');
const router = express.Router();
const middleware = require('../middleware/auth');
const authController = require('../controllers/authController');

// Rotas /api/
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/users', middleware.verifyJWT, authController.search);


module.exports = router;
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/send-reset-otp', authController.sendResetOtp);
router.post('/forgot-password', authController.forgotPassword);

// Private routes
router.get('/me', authController.getMe);
module.exports = router;

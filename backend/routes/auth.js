const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/send-reset-otp', authController.sendResetOtp);
router.post('/forgot-password', authController.forgotPassword);

<<<<<<< HEAD
router.get('/me', authMiddleware, authController.getMe);

=======
// Private routes
router.get('/me', authController.getMe);
>>>>>>> b04ee65f072b9e09fda8801d5adbae1cccda64ee
module.exports = router;

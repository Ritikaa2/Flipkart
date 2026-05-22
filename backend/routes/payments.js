const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.post('/razorpay-qr', paymentController.createRazorpayQr);
router.post('/razorpay-order', paymentController.createRazorpayOrder);

module.exports = router;

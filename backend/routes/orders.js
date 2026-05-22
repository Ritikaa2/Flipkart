const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.post('/', orderController.placeOrder);
router.get('/', orderController.getOrders);
router.get('/details/:orderId', orderController.getOrderDetails);
router.put('/:orderId/cancel', orderController.cancelOrder);

module.exports = router;

const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', cartController.getCart);
router.post('/', cartController.addToCart);
router.put('/:cartItemId', cartController.updateQuantity);
router.delete('/:cartItemId', cartController.deleteCartItem);

module.exports = router;

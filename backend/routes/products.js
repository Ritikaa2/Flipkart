const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Public product routes
router.get('/', productController.getAllProducts);
router.get('/categories/list', productController.getCategories);
router.get('/search', productController.searchProducts);
router.get('/category/:category', productController.getProductsByCategory);
router.get('/:id', productController.getProductById);

module.exports = router;

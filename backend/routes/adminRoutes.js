const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { 
  getProducts,
  getSingleProduct,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');
const upload = require('../utils/multerConfig');

// Protect all routes after this middleware
router.use(protect);
router.use(authorize('admin'));

// Admin Product routes
router.route('/products')
  .get(getProducts)
  .post(upload.array('images', 5), createProduct);

router.route('/products/:id')
  .get(getSingleProduct)
  .put(upload.array('images', 5), updateProduct)
  .delete(deleteProduct);

module.exports = router; 
const express = require('express');
const router = express.Router();

// Import controller functions properly - ensure they exist
const { 
  getProducts,
  getSingleProduct,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');

// Make sure routes are properly defined with valid controller functions
router.route('/products').get(getProducts).post(createProduct);
router.route('/products/:id').get(getSingleProduct).put(updateProduct).delete(deleteProduct);

module.exports = router;
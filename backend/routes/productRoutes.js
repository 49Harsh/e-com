const express = require('express');
const router = express.Router();
const upload = require('../utils/multerConfig');
const { protect } = require('../middleware/auth');

// Import controller functions properly - ensure they exist
const { 
  getProducts,
  getSingleProduct,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');

// Public routes
router.get('/', getProducts);
router.get('/:id', getSingleProduct);

// Protected routes
router.use(protect);
router.post('/', upload.array('images', 5), createProduct);
router.put('/:id', upload.array('images', 5), updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;
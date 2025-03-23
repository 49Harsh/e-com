const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  createOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus
} = require('../controllers/orderController');

// User routes
router.use(protect); // Protect all order routes
router.post('/', createOrder);
router.get('/my-orders', getUserOrders);

// Admin routes
router.get('/admin', getAllOrders);
router.put('/admin/:id', updateOrderStatus);

module.exports = router; 
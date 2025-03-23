const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  createOrder,
  getOrders,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  getAdminOrders
} = require('../controllers/orderController');

// Public routes
router.post('/', protect, createOrder);
router.get('/my-orders', protect, getMyOrders);

// Admin routes
router.get('/admin', protect, authorize('admin'), getAdminOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/status', protect, authorize('admin'), updateOrderStatus);

module.exports = router; 
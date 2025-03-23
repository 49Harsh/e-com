const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  createOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus
} = require('../controllers/orderController');

router.post('/', protect, createOrder);
router.get('/my-orders', protect, getUserOrders);
router.get('/admin', protect, authorize('admin'), getAllOrders);
router.put('/admin/:id', protect, authorize('admin'), updateOrderStatus);

module.exports = router; 
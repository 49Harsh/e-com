const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  createOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus
} = require('../controllers/orderController');

router.use(protect);

router.route('/')
  .post(createOrder)
  .get(getUserOrders);

// Admin routes
router.use(authorize('admin'));
router.route('/admin')
  .get(getAllOrders);
router.route('/admin/:id')
  .put(updateOrderStatus);

module.exports = router; 
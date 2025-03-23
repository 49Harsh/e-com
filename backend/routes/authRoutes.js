const express = require('express');
const router = express.Router();

const {
  registerCustomer,
  registerAdmin,
  login,
  getMe,
  logout
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Public routes
router.post('/register/customer', registerCustomer);
router.post('/register/admin', registerAdmin);
router.post('/login', login);
router.post('/logout', logout);

// Protected routes
router.get('/me', protect, getMe);

module.exports = router; 
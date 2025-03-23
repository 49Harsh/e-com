const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
} = require('../controllers/cartController');

router.use(protect);

router.route('/')
  .get(getCart)
  .post(addToCart);

router.route('/item')
  .put(updateCartItem);

router.route('/item/:itemId')
  .delete(removeFromCart);

router.delete('/', clearCart);

module.exports = router; 
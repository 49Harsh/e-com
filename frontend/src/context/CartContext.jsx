import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';
import { getCart, addToCart as apiAddToCart, updateCartItem as apiUpdateCartItem, removeFromCart as apiRemoveFromCart } from '../api/api';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchCart = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const response = await getCart();
      setCart(response.cart);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
      toast.error('Failed to fetch cart');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity, size) => {
    try {
      setLoading(true);
      const response = await apiAddToCart(productId, quantity, size);
      setCart(response.cart);
      toast.success('Added to cart successfully');
      return response.cart;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add to cart');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateCartItem = async (itemId, quantity) => {
    try {
      setLoading(true);
      const response = await apiUpdateCartItem(itemId, quantity);
      setCart(response.cart);
      toast.success('Cart updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update cart');
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      setLoading(true);
      const response = await apiRemoveFromCart(itemId);
      setCart(response.cart);
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error('Failed to remove item from cart');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCart(null);
    }
  }, [user]);

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addToCart,
        updateCartItem,
        removeFromCart,
        fetchCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
}; 
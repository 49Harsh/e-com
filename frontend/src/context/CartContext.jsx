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

  const addItemToCart = async (productId, quantity, size) => {
    try {
      setLoading(true);
      const response = await apiAddToCart(productId, quantity, size);
      setCart(response.cart);
      toast.success('Item added to cart');
      return response.cart;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add item to cart');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateItem = async (itemId, quantity) => {
    try {
      setLoading(true);
      const response = await apiUpdateCartItem(itemId, quantity);
      setCart(response.cart);
      toast.success('Cart updated');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update cart');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (itemId) => {
    try {
      setLoading(true);
      const response = await apiRemoveFromCart(itemId);
      setCart(response.cart);
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to remove item');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const clearCart = () => {
    setCart(null);
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
        addItemToCart,
        updateItem,
        removeItem,
        clearCart,
        fetchCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
}; 
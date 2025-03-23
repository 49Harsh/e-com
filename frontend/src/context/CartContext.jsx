import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';
import axios from 'axios';

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
      const response = await axios.get('http://localhost:5000/api/v1/cart', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setCart(response.data.cart);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity, size) => {
    try {
      setLoading(true);
      const response = await axios.post(
        'http://localhost:5000/api/v1/cart',
        { productId, quantity, size },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      setCart(response.data.cart);
      return response.data.cart;
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
      const response = await axios.put(
        'http://localhost:5000/api/v1/cart/item',
        { itemId, quantity },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      setCart(response.data.cart);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update cart');
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      setLoading(true);
      const response = await axios.delete(
        `http://localhost:5000/api/v1/cart/item/${itemId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      setCart(response.data.cart);
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
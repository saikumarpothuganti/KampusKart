import React, { createContext, useState, useContext, useEffect } from 'react';
import API from '../lib/api.js';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    // Don't fetch if no token (user not logged in)
    const token = localStorage.getItem('token');
    if (!token) {
      setCart({ items: [] });
      return;
    }

    try {
      setLoading(true);
      const res = await API.get('/cart');
      setCart(res.data);
    } catch (error) {
      // Don't log error if it's a 401 (will be handled by interceptor)
      if (error.response?.status !== 401) {
        console.error('Failed to fetch cart:', error);
      }
      setCart({ items: [] });
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (item) => {
    try {
      const res = await API.post('/cart/add', item);
      setCart(res.data);
      return res.data;
    } catch (error) {
      console.error('Failed to add to cart:', error);
      throw error;
    }
  };

  const updateItem = async (itemIndex, updates) => {
    try {
      const res = await API.put(`/cart/${itemIndex}`, updates);
      setCart(res.data);
      return res.data;
    } catch (error) {
      console.error('Failed to update cart item:', error);
      throw error;
    }
  };

  const removeItem = async (itemIndex) => {
    try {
      const res = await API.delete(`/cart/${itemIndex}`);
      setCart(res.data);
      return res.data;
    } catch (error) {
      console.error('Failed to remove from cart:', error);
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      await API.delete('/cart');
      setCart({ items: [] });
    } catch (error) {
      console.error('Failed to clear cart:', error);
      throw error;
    }
  };

  const getTotalPrice = () => {
    return cart.items.reduce((total, item) => {
      const price = item.userPrice ?? item.price ?? 0;
      return total + price * item.qty;
    }, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        fetchCart,
        addToCart,
        updateItem,
        removeItem,
        clearCart,
        getTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

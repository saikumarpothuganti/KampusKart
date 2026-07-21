import React, { createContext, useState, useContext, useEffect } from 'react';
import API from '../lib/api.js';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [carts, setCarts] = useState([]);
  const [activeCartId, setActiveCartId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCarts = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setCarts([]);
      setActiveCartId(null);
      return;
    }

    try {
      setLoading(true);
      const res = await API.get('/cart');
      const cartsData = Array.isArray(res.data) ? res.data : [];
      setCarts(cartsData);
      if (cartsData.length > 0 && !activeCartId) {
        setActiveCartId(cartsData[0]._id);
      }
    } catch (error) {
      if (error.response?.status !== 401) {
        console.error('Failed to fetch carts:', error);
      }
      setCarts([]);
    } finally {
      setLoading(false);
    }
  };

  const createCart = async (name) => {
    try {
      const res = await API.post('/cart/create', { name });
      const newCarts = Array.isArray(res.data) ? res.data : carts;
      setCarts(newCarts);
      // Auto-switch to the newly created cart (it's the last one)
      if (newCarts.length > 0) {
        setActiveCartId(newCarts[newCarts.length - 1]._id);
      }
      return newCarts;
    } catch (error) {
      console.error('Failed to create cart:', error);
      throw error;
    }
  };

  const addToCart = async (cartId, item, isRetry = false) => {
    try {
      const res = await API.post(`/cart/${cartId}/add`, item);
      setCarts(Array.isArray(res.data) ? res.data : carts);
      return res.data;
    } catch (error) {
      console.error('Failed to add to cart:', error);
      if (error.response?.status === 404 && !isRetry) {
        // Cart not found (maybe deleted in another tab or checkout)
        try {
          const updatedCartsRes = await API.get('/cart');
          const updatedCarts = Array.isArray(updatedCartsRes.data) ? updatedCartsRes.data : [];
          setCarts(updatedCarts);
          
          if (updatedCarts.length > 0) {
            // Auto-retry with the first available cart
            const retryRes = await API.post(`/cart/${updatedCarts[0]._id}/add`, item);
            setCarts(Array.isArray(retryRes.data) ? retryRes.data : updatedCarts);
            return retryRes.data;
          }
        } catch (retryError) {
          console.error('Auto-retry failed:', retryError);
          throw retryError;
        }
      }
      throw error;
    }
  };

  const updateItem = async (cartId, itemIndex, updates) => {
    try {
      const res = await API.put(`/cart/${cartId}/${itemIndex}`, updates);
      setCarts(Array.isArray(res.data) ? res.data : carts);
      return res.data;
    } catch (error) {
      console.error('Failed to update cart item:', error);
      throw error;
    }
  };

  const removeItem = async (cartId, itemIndex) => {
    try {
      const res = await API.delete(`/cart/${cartId}/${itemIndex}`);
      setCarts(Array.isArray(res.data) ? res.data : carts);
      return res.data;
    } catch (error) {
      console.error('Failed to remove from cart:', error);
      throw error;
    }
  };

  const deleteCart = async (cartId) => {
    try {
      const res = await API.delete(`/cart/${cartId}`);
      const newCarts = Array.isArray(res.data) ? res.data : carts;
      setCarts(newCarts);
      if (activeCartId === cartId && newCarts.length > 0) {
        setActiveCartId(newCarts[0]._id);
      }
      return newCarts;
    } catch (error) {
      console.error('Failed to delete cart:', error);
      throw error;
    }
  };

  const getCartCount = () => {
    if (!Array.isArray(carts)) return 0;
    return carts.reduce((sum, cart) => {
      return sum + (cart.items ? cart.items.length : 0);
    }, 0);
  };

  const getActiveCartTotalPrice = () => {
    if (!Array.isArray(carts)) return 0;
    const activeCart = carts.find(c => c._id === activeCartId);
    if (!activeCart || !activeCart.items) return 0;
    
    return activeCart.items.reduce((total, item) => {
      const price = item.userPrice ?? item.price ?? 0;
      return total + price * item.qty;
    }, 0);
  };

  const getActiveCart = () => {
    if (!Array.isArray(carts)) return { items: [] };
    return carts.find(c => c._id === activeCartId) || { items: [] };
  };

  return (
    <CartContext.Provider
      value={{
        carts,
        activeCartId,
        setActiveCartId,
        loading,
        fetchCart: fetchCarts, // keeping legacy name to avoid breaking some imports
        createCart,
        addToCart,
        updateItem,
        removeItem,
        deleteCart,
        getCartCount,
        getActiveCartTotalPrice,
        getActiveCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

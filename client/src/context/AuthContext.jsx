import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../lib/api.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [ordersEnabled, setOrdersEnabled] = useState(true);
  const hasAttemptedAuth = useRef(false); // Prevent multiple auth attempts

  useEffect(() => {
    // Only fetch profile once on mount if token exists
    if (token && !hasAttemptedAuth.current) {
      hasAttemptedAuth.current = true;
      
      API.get('/auth/profile')
        .then((res) => {
          setUser(res.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Auth restore failed:', error);
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }

    // Listen for 401 logout events from API interceptor
    const handleLogout = () => {
      setToken(null);
      setUser(null);
    };

    window.addEventListener('auth:logout', handleLogout);
    return () => {
      window.removeEventListener('auth:logout', handleLogout);
    };
  }, []); // Only run once on mount

  // Fetch orders enabled status on mount
  useEffect(() => {
    const fetchOrdersEnabled = async () => {
      try {
        const res = await API.get('/admin/orders-enabled');
        setOrdersEnabled(res.data.enabled);
      } catch (error) {
        console.error('Failed to fetch orders enabled status:', error);
        // Default to true on error to avoid blocking
        setOrdersEnabled(true);
      }
    };
    fetchOrdersEnabled();
  }, []);

  const signup = async (name, userId, email, password) => {
    const res = await API.post('/auth/signup', { name, userId, email, password });
    localStorage.setItem('token', res.data.token);
    setToken(res.data.token);
    setUser(res.data.user);
    return res.data;
  };

  const signin = async (userId, password) => {
    const res = await API.post('/auth/signin', { userId, password });
    localStorage.setItem('token', res.data.token);
    setToken(res.data.token);
    setUser(res.data.user);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const refreshOrdersEnabled = async () => {
    try {
      const res = await API.get('/admin/orders-enabled');
      setOrdersEnabled(res.data.enabled);
      return res.data.enabled;
    } catch (error) {
      console.error('Failed to refresh orders enabled status:', error);
      return ordersEnabled;
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, ordersEnabled, refreshOrdersEnabled, signup, signin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

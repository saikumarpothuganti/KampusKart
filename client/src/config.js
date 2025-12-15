/**
 * KampusKart Frontend Configuration
 * Centralized environment-based configuration for API and Socket.io URLs
 */

const isDev = import.meta.env.DEV;

// API Base URL
export const API_BASE_URL = isDev
  ? import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'
  : import.meta.env.VITE_API_BASE_URL || '/api';

// Socket.io URL
export const SOCKET_URL = isDev
  ? import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000'
  : import.meta.env.VITE_SOCKET_URL || window.location.origin;

// Socket.io Configuration
export const SOCKET_CONFIG = {
  transports: ['websocket', 'polling'],
  withCredentials: true,
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 10,
};

export default {
  API_BASE_URL,
  SOCKET_URL,
  SOCKET_CONFIG,
};

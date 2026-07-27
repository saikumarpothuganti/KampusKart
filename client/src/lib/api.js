import axios from 'axios';
import { API_BASE_URL } from '../config.js';

const API = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Request interceptor: Add token to all requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: Handle 401 errors
// DO NOT use window.location.href here - it causes infinite reload loops
// Let the component handle navigation via useNavigate or <Navigate />
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // Normalize generic/network errors to a standard message
    const isNetworkError = !error.response;
    const hasServerErrorMessage = error.response && error.response.data && error.response.data.error;
    const isServerError = error.response && error.response.status >= 500;
    
    // Only use generic message if it's a true network error, OR a server error without a specific message
    if (error.code !== 'ERR_CANCELED' && (isNetworkError || (isServerError && !hasServerErrorMessage) || (error.response && !hasServerErrorMessage))) {
      const genericMsg = "Network / Internet issue. Please refresh.";
      error.message = genericMsg;
      if (!error.response) {
        error.response = { data: { error: genericMsg }, status: 0 };
      } else {
        error.response.data = error.response.data || {};
        error.response.data.error = genericMsg;
      }
    }

    if (error.response?.status === 401) {
      // Only remove token, don't redirect here
      // Components will detect missing token and redirect properly
      localStorage.removeItem('token');
      // Dispatch custom event that AuthContext can listen to
      window.dispatchEvent(new Event('auth:logout'));
    }
    return Promise.reject(error);
  }
);

export default API;

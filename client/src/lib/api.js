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

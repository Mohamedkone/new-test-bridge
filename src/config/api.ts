import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
export const WEBSOCKET_URL = import.meta.env.VITE_WEBSOCKET_URL || 'http://localhost:3000';

console.log('🌐 API Config:', {
  baseURL: API_BASE_URL,
  websocketURL: WEBSOCKET_URL,
  env: import.meta.env.MODE
});

// Create axios instance
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    console.log(`🌐 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🌐 API Request: Token added to headers');
    } else {
      console.log('🌐 API Request: No token found');
    }
    return config;
  },
  (error) => {
    console.error('🌐 API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log(`🌐 API Response: ${response.status} ${response.config.method?.toUpperCase()} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('🌐 API Response Error:', {
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url,
      method: error.config?.method
    });
    
    if (error.response?.status === 401) {
      console.log('🌐 API: 401 Unauthorized - clearing token and redirecting');
      // Token expired or invalid
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
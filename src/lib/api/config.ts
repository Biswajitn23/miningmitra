import axios from 'axios';

// Backend API URL
export const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'https://backend-b3ru.onrender.com';

// Create axios instance with default config
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enable CORS credentials
});

// Request interceptor for adding auth tokens if needed
apiClient.interceptors.request.use(
  (config) => {
    // Add any auth tokens here if needed
    // const token = localStorage.getItem('auth_token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Server responded with error status
      console.error('API Error:', error.response.status, error.response.data);
    } else if (error.request) {
      // Request made but no response
      console.error('Network Error: No response received');
    } else {
      // Error setting up request
      console.error('Request Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Health check endpoint
export const checkBackendHealth = async () => {
  try {
    const response = await apiClient.get('/health');
    console.log('✅ Backend connected successfully:', response.data);
    return true;
  } catch (error) {
    console.error('❌ Backend connection failed:', error);
    return false;
  }
};

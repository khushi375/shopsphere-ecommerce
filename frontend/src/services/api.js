import axios from 'axios';
import { auth } from '../firebase/config';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Automatically inject Authorization headers using Firebase Auth ID token
api.interceptors.request.use(async (config) => {
  try {
    if (auth && auth.currentUser) {
      const token = await auth.currentUser.getIdToken(true);
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      // Fallback for mock authentication token in development testing
      const mockToken = localStorage.getItem('mock_token');
      if (mockToken) {
        config.headers.Authorization = `Bearer ${mockToken}`;
      }
    }
  } catch (err) {
    console.warn("Axios Interceptor: Could not retrieve firebase ID token:", err.message);
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to inject JWT from localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const method = error.config?.method?.toUpperCase() || 'REQUEST';
      const url = `${error.config?.baseURL || ''}${error.config?.url || ''}`;
      console.error(
        `[API ${error.response.status}] ${method} ${url}`,
        error.response.data?.message || error.response.data
      );
    } else {
      console.error('[API ERROR]', error.message);
    }

    return Promise.reject(error);
  }
);

export default api;

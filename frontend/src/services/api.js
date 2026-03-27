import axios from 'axios';

// Create an Axios instance pointing to a placeholder API URL
const api = axios.create({
  baseURL: '/api', // Using Vite proxy
});

// Add a request interceptor to attach JWT token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;

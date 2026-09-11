import axios from 'axios';

// Single axios instance so base URL, auth header, and 401 handling
// are configured once instead of repeated in every service file.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'Something went wrong. Please try again.';
    // Attach a normalized message so components don't need to know
    // about axios's error shape.
    return Promise.reject({ ...error, message });
  }
);

export default api;

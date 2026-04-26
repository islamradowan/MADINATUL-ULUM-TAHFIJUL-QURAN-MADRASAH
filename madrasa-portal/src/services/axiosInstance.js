import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'https://madinatul-ulum-tahfijul-quran-madrasah.onrender.com/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token from localStorage on every request
axiosInstance.interceptors.request.use((config) => {
  try {
    const stored = localStorage.getItem('madrasa_admin');
    const token = stored ? JSON.parse(stored)?.token : null;
    if (token) config.headers.Authorization = `Bearer ${token}`;
  } catch {
    // ignore parse errors
  }
  return config;
});

// Normalise error responses — auto-logout on 401
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('madrasa_admin');
      window.location.replace('/admin/login');
    }
    const message =
      error.response?.data?.message || error.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

export default axiosInstance;

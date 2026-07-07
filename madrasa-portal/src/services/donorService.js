import axios from 'axios';

const donorApi = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'https://madinatul-ulum-tahfijul-quran-madrasah.onrender.com/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

donorApi.interceptors.request.use((config) => {
  try {
    const stored = localStorage.getItem('madrasa_donor');
    const token = stored ? JSON.parse(stored)?.token : null;
    if (token) config.headers.Authorization = `Bearer ${token}`;
  } catch { /* ignore */ }
  return config;
});

donorApi.interceptors.response.use(
  (r) => r,
  (error) => {
    if (error.response?.status === 401) {
      const stored = localStorage.getItem('madrasa_donor');
      if (stored) {
        localStorage.removeItem('madrasa_donor');
        window.location.replace('/donor/login');
      }
    }
    return Promise.reject(new Error(error.response?.data?.message || error.message));
  }
);

export const donorService = {
  register:      (data)   => donorApi.post('/donor/register', data),
  login:         (data)   => donorApi.post('/donor/login', data),
  getMe:         ()       => donorApi.get('/donor/me'),
  myDonations:   ()       => donorApi.get('/donor/my-donations'),
};

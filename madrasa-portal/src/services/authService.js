import api from './axiosInstance';

export const authService = {
  login: (email, password) => api.post('/auth/login', { email, password }),
};

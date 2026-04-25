import api from './axiosInstance';

export const transparencyService = {
  get: () => api.get('/transparency'),
};

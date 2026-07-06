import api from './axiosInstance';

export const goldService = {
  getPrice: () => api.get('/gold-price'),
};

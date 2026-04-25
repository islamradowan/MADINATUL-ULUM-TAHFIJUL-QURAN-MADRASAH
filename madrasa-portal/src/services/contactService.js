import api from './axiosInstance';

export const contactService = {
  send: (data) => api.post('/contact', data),
};

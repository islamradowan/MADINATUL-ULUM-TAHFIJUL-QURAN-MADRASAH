import api from './axiosInstance';

const BASE = '/donations';

export const donationService = {
  getAll:     (params) => api.get(BASE, { params }),
  create:     (data)   => api.post(BASE, data),
  getProjects: ()      => api.get(`${BASE}/projects`),
};

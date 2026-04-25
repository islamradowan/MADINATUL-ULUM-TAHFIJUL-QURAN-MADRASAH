import api from './axiosInstance';

const BASE = '/reports';

export const reportService = {
  getAll:  (params) => api.get(BASE, { params }),
  export:  (params) => api.get(`${BASE}/export`, { params, responseType: 'blob' }),
};

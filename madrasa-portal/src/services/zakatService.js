import api from './axiosInstance';

const BASE = '/zakat';

export const zakatService = {
  calculate: (data)        => api.post(`${BASE}/calculate`, data),
  donate:    (data)        => api.post(`${BASE}/donate`, data),
  getAll:    (params)      => api.get(BASE, { params }),
  updateStatus: (id, status) => api.patch(`${BASE}/${id}`, { status }),
};

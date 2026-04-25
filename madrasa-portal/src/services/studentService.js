import api from './axiosInstance';

const BASE = '/students';

export const studentService = {
  getAll:          (params)        => api.get(BASE, { params }),
  getById:         (id)            => api.get(`${BASE}/${id}`),
  create:          (data)          => api.post(BASE, data),
  update:          (id, data)      => api.put(`${BASE}/${id}`, data),
  remove:          (id)            => api.delete(`${BASE}/${id}`),
  getClasses:      ()              => api.get(`${BASE}/classes`),
  getFees:         (id)            => api.get(`${BASE}/${id}/fees`),
  upsertFee:       (id, data)      => api.post(`${BASE}/${id}/fees`, data),
  generateYearFees:(id, year)      => api.post(`${BASE}/${id}/fees/generate`, { year }),
  toggleFee:       (id, feeId)     => api.patch(`${BASE}/${id}/fees/${feeId}/toggle`),
  deleteFee:       (id, feeId)     => api.delete(`${BASE}/${id}/fees/${feeId}`),
};

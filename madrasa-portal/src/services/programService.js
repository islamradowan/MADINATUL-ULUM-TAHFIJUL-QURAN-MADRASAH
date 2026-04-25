import api from './axiosInstance';

const BASE = '/programs';

export const programService = {
  getAll:  ()          => api.get(BASE),
  create:  (name)      => api.post(BASE, { name }),
  update:  (id, name)  => api.put(`${BASE}/${id}`, { name }),
  remove:  (id)        => api.delete(`${BASE}/${id}`),
};

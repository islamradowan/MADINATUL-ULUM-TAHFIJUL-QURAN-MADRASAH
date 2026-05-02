import axiosInstance from './axiosInstance';

const transactionService = {
  getAll: (params) => axiosInstance.get('/payment/transactions', { params }),
  getById: (id) => axiosInstance.get(`/payment/transaction/${id}`),
};

export default transactionService;

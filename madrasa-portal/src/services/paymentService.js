import axiosInstance from './axiosInstance';

const paymentService = {
  initPayment: (data) => axiosInstance.post('/payment/init', data),
  validatePayment: (data) => axiosInstance.post('/payment/validate', data),
  getTransaction: (transactionId) => axiosInstance.get(`/payment/transaction/${transactionId}`),
};

export default paymentService;

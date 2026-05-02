const express = require('express');
const { initPayment, validatePayment, handleIPN, getTransaction, getAllTransactions, handleSuccess, handleFail, handleCancel } = require('../controllers/paymentController');

const router = express.Router();

router.post('/init', initPayment);
router.post('/validate', validatePayment);
router.post('/ipn', handleIPN);
router.get('/transaction/:id', getTransaction);
router.get('/transactions', getAllTransactions);

// SSLCommerz redirect handlers (support both GET and POST)
router.get('/success', handleSuccess);
router.post('/success', handleSuccess);
router.get('/fail', handleFail);
router.post('/fail', handleFail);
router.get('/cancel', handleCancel);
router.post('/cancel', handleCancel);

module.exports = router;

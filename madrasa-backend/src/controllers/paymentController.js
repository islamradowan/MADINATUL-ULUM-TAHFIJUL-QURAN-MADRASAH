const SSLCommerzPayment = require('sslcommerz-lts');
const Transaction = require('../models/Transaction');
const Donation = require('../models/Donation');
const Zakat = require('../models/Zakat');

const store_id = process.env.SSLCOMMERZ_STORE_ID;
const store_passwd = process.env.SSLCOMMERZ_STORE_PASSWORD;
const is_live = process.env.SSLCOMMERZ_IS_LIVE === 'true';

// POST /api/payment/init
const initPayment = async (req, res, next) => {
  try {
    const { type, amount, donorName, donorEmail, donorPhone, projectType, allocationType, paymentMethod } = req.body;

    console.log('Payment init request:', { type, amount, donorName, projectType, allocationType, paymentMethod });

    if (!['donation', 'zakat'].includes(type)) {
      return res.status(400).json({ message: 'Invalid payment type' });
    }
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    // Generate unique transaction ID
    const transactionId = `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`;

    // Create transaction record
    const transaction = await Transaction.create({
      transactionId,
      type,
      amount: Number(amount),
      donorName: donorName || 'Anonymous',
      donorEmail,
      donorPhone,
      projectType: projectType || undefined,
      allocationType: type === 'zakat' ? allocationType : undefined,
      status: 'Pending',
      metadata: { paymentMethod: paymentMethod || 'Card' },
    });

    console.log('Transaction created:', transactionId);

    // SSLCommerz payment data
    const data = {
      total_amount: Number(amount),
      currency: 'BDT',
      tran_id: transactionId,
      success_url: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/payment/success`,
      fail_url: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/payment/fail`,
      cancel_url: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/payment/cancel`,
      ipn_url: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/payment/ipn`,
      product_name: type === 'donation' ? `Donation - ${projectType}` : `Zakat - ${allocationType}`,
      product_category: type,
      product_profile: 'non-physical-goods',
      cus_name: donorName || 'Anonymous',
      cus_email: donorEmail || 'donor@madrasa.com',
      cus_phone: donorPhone || '01700000000',
      cus_add1: 'Barishal, Bangladesh',
      cus_city: 'Barishal',
      cus_state: 'Barishal',
      cus_postcode: '8200',
      cus_country: 'Bangladesh',
      shipping_method: 'NO',
      emi_option: 0,
    };

    // Add payment method specific configuration
    if (paymentMethod === 'bKash') {
      data.multi_card_name = 'bkash';
    } else if (paymentMethod === 'Nagad') {
      data.multi_card_name = 'nagad';
    } else if (paymentMethod === 'Rocket') {
      data.multi_card_name = 'rocket';
    }

    console.log('Initializing SSLCommerz with store_id:', store_id, 'payment method:', paymentMethod);

    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
    
    let apiResponse;
    try {
      apiResponse = await sslcz.init(data);
    } catch (sslError) {
      console.error('SSLCommerz API Error:', sslError.message);
      transaction.status = 'Failed';
      await transaction.save();
      return res.status(503).json({ 
        message: 'Payment gateway temporarily unavailable. Please try again or use another payment method.',
        error: 'GATEWAY_TIMEOUT'
      });
    }

    console.log('SSLCommerz response:', apiResponse?.status);

    if (apiResponse?.GatewayPageURL) {
      // Update transaction with session info
      transaction.sessionKey = apiResponse.sessionkey;
      transaction.gatewayPageURL = apiResponse.GatewayPageURL;
      await transaction.save();

      console.log('Gateway URL generated:', apiResponse.GatewayPageURL);

      res.json({
        success: true,
        gatewayUrl: apiResponse.GatewayPageURL,
        transactionId,
      });
    } else {
      console.error('SSLCommerz init failed:', apiResponse);
      transaction.status = 'Failed';
      await transaction.save();
      res.status(500).json({ message: 'Payment gateway initialization failed', details: apiResponse });
    }
  } catch (err) {
    console.error('Payment init error:', err);
    next(err);
  }
};

// POST /api/payment/validate
const validatePayment = async (req, res, next) => {
  try {
    const { tran_id, val_id } = req.body;

    const transaction = await Transaction.findOne({ transactionId: tran_id });
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    if (transaction.status === 'Success') {
      return res.json({ success: true, message: 'Already validated', transaction });
    }

    // Validate with SSLCommerz
    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
    const validation = await sslcz.validate({ val_id });

    if (validation.status === 'VALID' || validation.status === 'VALIDATED') {
      transaction.status = 'Success';
      transaction.valId = val_id;
      transaction.cardType = validation.card_type;
      transaction.cardBrand = validation.card_brand;
      transaction.bankTranId = validation.bank_tran_id;
      await transaction.save();

      // Create donation or zakat record
      if (transaction.type === 'donation') {
        const donation = await Donation.create({
          projectType: transaction.projectType,
          amount: transaction.amount,
          donorName: transaction.donorName,
          paymentMethod: 'Card',
          status: 'Completed',
        });
        transaction.donationId = donation._id;
        await transaction.save();
      } else if (transaction.type === 'zakat') {
        const zakat = await Zakat.create({
          donorName: transaction.donorName,
          totalAmount: transaction.amount,
          allocationType: transaction.allocationType,
          paymentMethod: 'Card',
          status: 'Verified',
        });
        transaction.zakatId = zakat._id;
        await transaction.save();
      }

      res.json({ success: true, message: 'Payment validated successfully', transaction });
    } else {
      transaction.status = 'Failed';
      await transaction.save();
      res.status(400).json({ success: false, message: 'Payment validation failed' });
    }
  } catch (err) {
    next(err);
  }
};

// POST /api/payment/ipn (SSLCommerz webhook)
const handleIPN = async (req, res) => {
  try {
    const { tran_id, val_id, status } = req.body;

    const transaction = await Transaction.findOne({ transactionId: tran_id });
    if (!transaction) return res.status(200).send('OK');

    if (status === 'VALID' || status === 'VALIDATED') {
      transaction.status = 'Success';
      transaction.valId = val_id;
      await transaction.save();

      // Create donation/zakat record if not already created
      if (transaction.type === 'donation' && !transaction.donationId) {
        const donation = await Donation.create({
          projectType: transaction.projectType,
          amount: transaction.amount,
          donorName: transaction.donorName,
          paymentMethod: transaction.metadata?.paymentMethod || 'Card',
          status: 'Completed',
        });
        transaction.donationId = donation._id;
        await transaction.save();
      } else if (transaction.type === 'zakat' && !transaction.zakatId) {
        const zakat = await Zakat.create({
          donorName: transaction.donorName,
          totalAmount: transaction.amount,
          allocationType: transaction.allocationType,
          projectType: transaction.projectType,
          paymentMethod: transaction.metadata?.paymentMethod || 'Card',
          status: 'Verified',
        });
        transaction.zakatId = zakat._id;
        await transaction.save();
      }
    } else {
      transaction.status = 'Failed';
      await transaction.save();
    }

    res.status(200).send('OK');
  } catch (err) {
    console.error('IPN Error:', err);
    res.status(200).send('OK');
  }
};

// GET /api/payment/transaction/:id
const getTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findOne({ transactionId: req.params.id });
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    res.json(transaction);
  } catch (err) {
    next(err);
  }
};

// GET /api/payment/transactions (Admin - get all transactions)
const getAllTransactions = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, status, type, projectType, dateFrom, dateTo, amountMin, amountMax } = req.query;
    const query = {};
    
    if (status) query.status = status;
    if (type) query.type = type;
    if (projectType) query.projectType = projectType;
    
    if (search) {
      query.$or = [
        { transactionId: { $regex: search, $options: 'i' } },
        { donorName: { $regex: search, $options: 'i' } },
        { donorEmail: { $regex: search, $options: 'i' } },
      ];
    }

    // Date range filter
    if (dateFrom || dateTo) {
      query.createdAt = {};
      if (dateFrom) query.createdAt.$gte = new Date(dateFrom);
      if (dateTo) {
        const endDate = new Date(dateTo);
        endDate.setHours(23, 59, 59, 999);
        query.createdAt.$lte = endDate;
      }
    }

    // Amount range filter
    if (amountMin || amountMax) {
      query.amount = {};
      if (amountMin) query.amount.$gte = Number(amountMin);
      if (amountMax) query.amount.$lte = Number(amountMax);
    }

    const total = await Transaction.countDocuments(query);
    const transactions = await Transaction.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate('donationId')
      .populate('zakatId');

    res.json({
      transactions,
      total,
      page: Number(page),
    });
  } catch (err) {
    next(err);
  }
};

// GET/POST /api/payment/success (SSLCommerz redirect)
const handleSuccess = async (req, res) => {
  try {
    console.log('Success callback - Method:', req.method);
    console.log('Success callback - Body:', req.body);
    console.log('Success callback - Query:', req.query);
    
    const params = req.method === 'POST' ? req.body : req.query;
    const { tran_id, val_id, status } = params;
    
    console.log('Payment success callback:', { tran_id, val_id, status, method: req.method });
    
    const transaction = await Transaction.findOne({ transactionId: tran_id });
    if (!transaction) {
      console.error('Transaction not found:', tran_id);
      return res.redirect(`${process.env.FRONTEND_URL}/payment/fail?error=transaction_not_found`);
    }

    // If already successful, just redirect
    if (transaction.status === 'Success') {
      return res.redirect(`${process.env.FRONTEND_URL}/payment/success?tran_id=${tran_id}`);
    }

    // For sandbox, we can trust the callback if status is VALID/VALIDATED
    if (status === 'VALID' || status === 'VALIDATED' || !is_live) {
      transaction.status = 'Success';
      transaction.valId = val_id;
      await transaction.save();

      // Create donation or zakat record
      if (transaction.type === 'donation' && !transaction.donationId) {
        const donation = await Donation.create({
          projectType: transaction.projectType,
          amount: transaction.amount,
          donorName: transaction.donorName,
          paymentMethod: transaction.metadata?.paymentMethod || 'Card',
          status: 'Completed',
        });
        transaction.donationId = donation._id;
        await transaction.save();
        console.log('Donation created:', donation._id);
      } else if (transaction.type === 'zakat' && !transaction.zakatId) {
        const zakat = await Zakat.create({
          donorName: transaction.donorName,
          totalAmount: transaction.amount,
          allocationType: transaction.allocationType,
          projectType: transaction.projectType,
          paymentMethod: transaction.metadata?.paymentMethod || 'Card',
          status: 'Verified',
        });
        transaction.zakatId = zakat._id;
        await transaction.save();
        console.log('Zakat created:', zakat._id);
      }

      return res.redirect(`${process.env.FRONTEND_URL}/payment/success?tran_id=${tran_id}`);
    }

    // For production, validate with SSLCommerz
    if (is_live && val_id) {
      const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
      const validation = await sslcz.validate({ val_id });

      if (validation.status === 'VALID' || validation.status === 'VALIDATED') {
        transaction.status = 'Success';
        transaction.valId = val_id;
        transaction.cardType = validation.card_type;
        transaction.cardBrand = validation.card_brand;
        transaction.bankTranId = validation.bank_tran_id;
        await transaction.save();

        // Create donation or zakat record
        if (transaction.type === 'donation' && !transaction.donationId) {
          const donation = await Donation.create({
            projectType: transaction.projectType,
            amount: transaction.amount,
            donorName: transaction.donorName,
            paymentMethod: transaction.metadata?.paymentMethod || 'Card',
            status: 'Completed',
          });
          transaction.donationId = donation._id;
          await transaction.save();
        } else if (transaction.type === 'zakat' && !transaction.zakatId) {
          const zakat = await Zakat.create({
            donorName: transaction.donorName,
            totalAmount: transaction.amount,
            allocationType: transaction.allocationType,
            projectType: transaction.projectType,
            paymentMethod: transaction.metadata?.paymentMethod || 'Card',
            status: 'Verified',
          });
          transaction.zakatId = zakat._id;
          await transaction.save();
        }

        return res.redirect(`${process.env.FRONTEND_URL}/payment/success?tran_id=${tran_id}`);
      }
    }

    // If we reach here, validation failed
    transaction.status = 'Failed';
    await transaction.save();
    res.redirect(`${process.env.FRONTEND_URL}/payment/fail?tran_id=${tran_id}`);
  } catch (err) {
    console.error('Success handler error:', err);
    res.redirect(`${process.env.FRONTEND_URL}/payment/fail?error=validation_failed`);
  }
};

// GET/POST /api/payment/fail (SSLCommerz redirect)
const handleFail = async (req, res) => {
  try {
    const { tran_id } = req.method === 'POST' ? req.body : req.query;
    
    const transaction = await Transaction.findOne({ transactionId: tran_id });
    if (transaction) {
      transaction.status = 'Failed';
      await transaction.save();
    }

    res.redirect(`${process.env.FRONTEND_URL}/payment/fail?tran_id=${tran_id}`);
  } catch (err) {
    console.error('Fail handler error:', err);
    res.redirect(`${process.env.FRONTEND_URL}/payment/fail`);
  }
};

// GET/POST /api/payment/cancel (SSLCommerz redirect)
const handleCancel = async (req, res) => {
  try {
    const { tran_id } = req.method === 'POST' ? req.body : req.query;
    
    const transaction = await Transaction.findOne({ transactionId: tran_id });
    if (transaction) {
      transaction.status = 'Cancelled';
      await transaction.save();
    }

    res.redirect(`${process.env.FRONTEND_URL}/payment/cancel?tran_id=${tran_id}`);
  } catch (err) {
    console.error('Cancel handler error:', err);
    res.redirect(`${process.env.FRONTEND_URL}/payment/cancel`);
  }
};

module.exports = { initPayment, validatePayment, handleIPN, getTransaction, getAllTransactions, handleSuccess, handleFail, handleCancel };

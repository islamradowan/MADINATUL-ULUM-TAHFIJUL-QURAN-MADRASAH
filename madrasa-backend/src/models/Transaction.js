const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  transactionId:  { type: String, required: true, unique: true },
  type:           { type: String, enum: ['donation', 'zakat'], required: true },
  amount:         { type: Number, required: true },
  currency:       { type: String, default: 'BDT' },
  status:         { type: String, enum: ['Pending', 'Success', 'Failed', 'Cancelled'], default: 'Pending' },
  
  // SSLCommerz fields
  sessionKey:     { type: String },
  gatewayPageURL: { type: String },
  valId:          { type: String },
  cardType:       { type: String },
  cardBrand:      { type: String },
  bankTranId:     { type: String },
  
  // Donor info
  donorName:      { type: String, default: 'Anonymous' },
  donorEmail:     { type: String },
  donorPhone:     { type: String },
  
  // For donations
  projectType:    { type: String },
  
  // For zakat
  allocationType: { type: String },
  
  // References
  donationId:     { type: mongoose.Schema.Types.ObjectId, ref: 'Donation' },
  zakatId:        { type: mongoose.Schema.Types.ObjectId, ref: 'Zakat' },
  
  metadata:       { type: mongoose.Schema.Types.Mixed },
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);

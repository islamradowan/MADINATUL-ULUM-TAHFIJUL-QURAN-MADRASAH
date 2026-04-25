const mongoose = require('mongoose');

const zakatSchema = new mongoose.Schema({
  donorName:      { type: String, default: 'Anonymous' },
  totalAmount:    { type: Number, required: true },
  allocationType: { type: String, required: true },
  paymentMethod:  { type: String, enum: ['Card', 'bKash', 'Nagad', 'Bank', 'Cash'], default: 'Cash' },
  status:         { type: String, enum: ['Verified', 'Pending'], default: 'Pending' },
  date:           { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Zakat', zakatSchema);

const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  projectType:   { 
    type: String, 
    required: true,
    enum: ['Masjid and Madrasha Complex', 'Poor Student Support', 'An Nusrah Skill Development', 'Ifter Fund']
  },
  amount:        { type: Number, required: true },
  donorName:     { type: String, default: 'Anonymous' },
  paymentMethod: { type: String, enum: ['Card', 'bKash', 'Nagad', 'Rocket'], default: 'Card' },
  status:        { type: String, enum: ['Completed', 'Pending', 'Failed'], default: 'Completed' },
  date:          { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Donation', donationSchema);

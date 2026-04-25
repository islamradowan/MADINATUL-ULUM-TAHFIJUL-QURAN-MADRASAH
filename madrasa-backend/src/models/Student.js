const mongoose = require('mongoose');

const monthlyFeeSchema = new mongoose.Schema({
  year:     { type: Number, required: true },
  month:    { type: Number, required: true, min: 1, max: 12 },
  amount:   { type: Number, required: true, default: 0 },
  paid:     { type: Number, default: 0 },
  due:      { type: Number, default: 0 },
  paidDate: { type: Date,   default: null },
  note:     { type: String, default: '' },
  disabled: { type: Boolean, default: true }, // excluded from totals until explicitly enabled
}, { _id: true });

// Auto-calculate due on each monthly entry
monthlyFeeSchema.pre('save', function (next) {
  this.due = Math.max(0, this.amount - this.paid);
  next();
});

const studentSchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true },
  class:       { type: String, required: true },
  guardian:    { type: String, required: true },
  phone:       { type: String, required: true },
  fees:        { type: Number, required: true, default: 0 }, // monthly fee rate
  paid:        { type: Number, default: 0 },  // cumulative total paid
  due:         { type: Number, default: 0 },  // cumulative total due
  status:      { type: String, enum: ['Active', 'Inactive', 'Graduated'], default: 'Active' },
  monthlyFees: { type: [monthlyFeeSchema], default: [] },
}, { timestamps: true });

// Auto-calculate cumulative paid/due from enabled monthlyFees before save
studentSchema.pre('save', function (next) {
  if (this.monthlyFees && this.monthlyFees.length > 0) {
    const enabled = this.monthlyFees.filter(f => !f.disabled);
    this.paid = enabled.reduce((s, f) => s + (f.paid ?? 0), 0);
    this.due  = enabled.reduce((s, f) => s + (f.due  ?? 0), 0);
  }
  next();
});

module.exports = mongoose.model('Student', studentSchema);

const mongoose = require('mongoose');

const vipSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  status: {
    type: String,
    enum: ['active', 'cancelled', 'expired'],
    default: 'active'
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date
  },
  autoRenew: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Calculate end date before saving (30 days from start)
vipSchema.pre('save', function(next) {
  if (this.isNew) {
    const endDate = new Date(this.startDate);
    endDate.setDate(endDate.getDate() + 30);
    this.endDate = endDate;
  }
  next();
});

const VIP = mongoose.model('VIP', vipSchema);

module.exports = VIP; 
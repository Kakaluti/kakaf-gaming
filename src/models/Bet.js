const mongoose = require('mongoose');

const betSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  odds: {
    type: Number,
    required: true,
    min: 1
  },
  potentialWinnings: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'won', 'lost', 'cancelled'],
    default: 'pending'
  },
  game: {
    type: String,
    required: true
  },
  betType: {
    type: String,
    required: true
  },
  betDetails: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  settledAt: {
    type: Date
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

// Calculate potential winnings before saving
betSchema.pre('save', function(next) {
  this.potentialWinnings = this.amount * this.odds;
  next();
});

const Bet = mongoose.model('Bet', betSchema);

module.exports = Bet; 
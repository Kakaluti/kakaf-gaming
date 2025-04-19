const Bet = require('../models/Bet');
const User = require('../models/User');

// Calculate rake (5% of winnings)
const calculateRake = (winnings) => {
  return winnings * 0.05;
};

// Place a bet
exports.placeBet = async (req, res) => {
  try {
    const { amount, odds, game, betType, betDetails } = req.body;
    const userId = req.user._id;

    // Validate required fields
    const missingFields = [];
    if (!amount) missingFields.push('amount');
    if (!odds) missingFields.push('odds');
    if (!game) missingFields.push('game');
    if (!betType) missingFields.push('betType');
    if (!betDetails) missingFields.push('betDetails');

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: 'Missing required fields',
        missingFields: missingFields,
        example: {
          amount: 10,
          odds: 2.0,
          game: "dice",
          betType: "number",
          betDetails: {
            number: 6,
            side: "high"
          }
        }
      });
    }

    // Validate bet amount
    if (amount <= 0) {
      return res.status(400).json({ message: 'Invalid bet amount' });
    }

    // Validate odds
    if (odds < 1) {
      return res.status(400).json({ message: 'Invalid odds' });
    }

    // Check user balance
    const user = await User.findById(userId);
    if (user.balance < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    // Create new bet
    const bet = new Bet({
      user: userId,
      amount,
      odds,
      game,
      betType,
      betDetails
    });

    // Deduct amount from user balance
    user.balance -= amount;
    await user.save();

    // Save bet
    await bet.save();

    res.status(201).json({
      message: 'Bet placed successfully',
      bet: {
        id: bet._id,
        amount: bet.amount,
        odds: bet.odds,
        potentialWinnings: bet.potentialWinnings,
        game: bet.game,
        betType: bet.betType,
        status: bet.status
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error placing bet', error: error.message });
  }
};

// Get bet history
exports.getBetHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const bets = await Bet.find({ user: userId })
      .sort({ createdAt: -1 })
      .select('-betDetails');

    res.json({
      bets
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bet history', error: error.message });
  }
};

// Get single bet
exports.getBet = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const bet = await Bet.findOne({ _id: id, user: userId });
    if (!bet) {
      return res.status(404).json({ message: 'Bet not found' });
    }

    res.json({
      bet
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bet', error: error.message });
  }
};

// Settle bet (admin only)
exports.settleBet = async (req, res) => {
  try {
    const { id } = req.params;
    const { result } = req.body; // 'won' or 'lost'

    // Find bet
    const bet = await Bet.findById(id);
    if (!bet) {
      return res.status(404).json({ message: 'Bet not found' });
    }

    if (bet.status !== 'pending') {
      return res.status(400).json({ message: 'Bet already settled' });
    }

    // Update bet status
    bet.status = result;
    bet.settledAt = new Date();
    await bet.save();

    // If bet won, add winnings to user balance (minus rake)
    if (result === 'won') {
      const user = await User.findById(bet.user);
      const rake = calculateRake(bet.potentialWinnings);
      const netWinnings = bet.potentialWinnings - rake;
      user.balance += netWinnings;
      await user.save();
    }

    res.json({
      message: 'Bet settled successfully',
      bet: {
        id: bet._id,
        status: bet.status,
        settledAt: bet.settledAt
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error settling bet', error: error.message });
  }
}; 
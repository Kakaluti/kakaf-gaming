const User = require('../models/User');

// Calculate fee (6%)
const calculateFee = (amount) => {
  return amount * 0.06;
};

// Deposit funds
exports.deposit = async (req, res) => {
  try {
    const { amount } = req.body;
    const userId = req.user._id;

    if (amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    // Calculate fee
    const fee = calculateFee(amount);
    const netAmount = amount - fee;

    // Update user balance
    const user = await User.findById(userId);
    user.balance += netAmount;
    await user.save();

    res.json({
      message: 'Deposit successful',
      amount,
      fee,
      netAmount,
      newBalance: user.balance
    });
  } catch (error) {
    res.status(500).json({ message: 'Error processing deposit', error: error.message });
  }
};

// Withdraw funds
exports.withdraw = async (req, res) => {
  try {
    const { amount } = req.body;
    const userId = req.user._id;

    if (amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    // Calculate fee
    const fee = calculateFee(amount);
    const totalAmount = amount + fee;

    // Check if user has sufficient balance
    const user = await User.findById(userId);
    if (user.balance < totalAmount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    // Update user balance
    user.balance -= totalAmount;
    await user.save();

    res.json({
      message: 'Withdrawal successful',
      amount,
      fee,
      totalAmount,
      newBalance: user.balance
    });
  } catch (error) {
    res.status(500).json({ message: 'Error processing withdrawal', error: error.message });
  }
};

// Get balance
exports.getBalance = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).select('balance');
    
    res.json({
      balance: user.balance
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching balance', error: error.message });
  }
};

// Get transaction history
exports.getTransactions = async (req, res) => {
  try {
    const userId = req.user._id;
    // TODO: Implement transaction history
    res.json({
      message: 'Transaction history endpoint',
      transactions: []
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching transactions', error: error.message });
  }
}; 
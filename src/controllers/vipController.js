const VIP = require('../models/VIP');
const User = require('../models/User');

// VIP subscription price
const VIP_PRICE = 10;

// Subscribe to VIP
exports.subscribe = async (req, res) => {
  try {
    const userId = req.user._id;

    // Check if user already has VIP
    const existingVIP = await VIP.findOne({ user: userId });
    if (existingVIP && existingVIP.status === 'active') {
      return res.status(400).json({ message: 'User already has an active VIP subscription' });
    }

    // Check user balance
    const user = await User.findById(userId);
    if (user.balance < VIP_PRICE) {
      return res.status(400).json({ message: 'Insufficient balance for VIP subscription' });
    }

    // Deduct VIP price from user balance
    user.balance -= VIP_PRICE;
    await user.save();

    // Create or update VIP subscription
    let vip;
    if (existingVIP) {
      existingVIP.status = 'active';
      existingVIP.startDate = new Date();
      existingVIP.autoRenew = true;
      await existingVIP.save();
      vip = existingVIP;
    } else {
      const startDate = new Date();
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 30);
      
      vip = new VIP({
        user: userId,
        startDate,
        endDate,
        status: 'active',
        autoRenew: true
      });
      await vip.save();
    }

    res.json({
      message: 'VIP subscription activated successfully',
      vip: {
        status: vip.status,
        startDate: vip.startDate,
        endDate: vip.endDate,
        autoRenew: vip.autoRenew
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error processing VIP subscription', error: error.message });
  }
};

// Get VIP status
exports.getStatus = async (req, res) => {
  try {
    const userId = req.user._id;

    const vip = await VIP.findOne({ user: userId });
    if (!vip) {
      return res.json({
        hasVIP: false,
        message: 'No active VIP subscription'
      });
    }

    res.json({
      hasVIP: true,
      vip: {
        status: vip.status,
        startDate: vip.startDate,
        endDate: vip.endDate,
        autoRenew: vip.autoRenew
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching VIP status', error: error.message });
  }
};

// Cancel VIP subscription
exports.cancel = async (req, res) => {
  try {
    const userId = req.user._id;

    const vip = await VIP.findOne({ user: userId });
    if (!vip) {
      return res.status(404).json({ message: 'No VIP subscription found' });
    }

    if (vip.status !== 'active') {
      return res.status(400).json({ message: 'VIP subscription is not active' });
    }

    // Update VIP status
    vip.status = 'cancelled';
    vip.autoRenew = false;
    await vip.save();

    res.json({
      message: 'VIP subscription cancelled successfully',
      vip: {
        status: vip.status,
        endDate: vip.endDate,
        autoRenew: vip.autoRenew
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error cancelling VIP subscription', error: error.message });
  }
}; 
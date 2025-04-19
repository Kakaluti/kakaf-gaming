const User = require('../models/User');
const nodemailer = require('nodemailer');

// Email transporter setup
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Generate random 6-digit code
const generateCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Request 2FA
exports.request2FA = async (req, res) => {
  try {
    const { email } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate verification code
    const code = generateCode();

    // Send verification email
    await transporter.sendMail({
      to: user.email,
      subject: '2FA Verification Code',
      html: `
        <p>Your 2FA verification code is: <strong>${code}</strong></p>
        <p>This code will expire in 10 minutes.</p>
      `
    });

    // Store code in user document (in a real app, use Redis for this)
    user.twoFactorCode = code;
    user.twoFactorCodeExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await user.save();

    res.json({
      message: '2FA code sent successfully'
    });
  } catch (error) {
    res.status(500).json({ message: 'Error sending 2FA code', error: error.message });
  }
};

// Verify 2FA
exports.verify2FA = async (req, res) => {
  try {
    const { email, code } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if code exists and is not expired
    if (!user.twoFactorCode || !user.twoFactorCodeExpires) {
      return res.status(400).json({ message: 'No active 2FA code found' });
    }

    if (user.twoFactorCodeExpires < new Date()) {
      return res.status(400).json({ message: '2FA code has expired' });
    }

    // Verify code
    if (user.twoFactorCode !== code) {
      return res.status(400).json({ message: 'Invalid 2FA code' });
    }

    // Enable 2FA for user
    user.is2FAEnabled = true;
    user.twoFactorCode = undefined;
    user.twoFactorCodeExpires = undefined;
    await user.save();

    res.json({
      message: '2FA enabled successfully'
    });
  } catch (error) {
    res.status(500).json({ message: 'Error verifying 2FA', error: error.message });
  }
}; 
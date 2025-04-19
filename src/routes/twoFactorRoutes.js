const express = require('express');
const router = express.Router();
const twoFactorController = require('../controllers/twoFactorController');
const { authenticate, isAdmin } = require('../middleware/auth');

// 2FA routes
router.post('/request', isAdmin, twoFactorController.request2FA);
router.post('/verify', isAdmin, twoFactorController.verify2FA);

module.exports = router; 
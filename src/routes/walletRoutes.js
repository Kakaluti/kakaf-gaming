const express = require('express');
const router = express.Router();
const walletController = require('../controllers/walletController');
const { authenticate } = require('../middleware/auth');

// All wallet routes require authentication
router.use(authenticate);

// Wallet routes
router.post('/deposit', walletController.deposit);
router.post('/withdraw', walletController.withdraw);
router.get('/balance', walletController.getBalance);
router.get('/transactions', walletController.getTransactions);

module.exports = router; 
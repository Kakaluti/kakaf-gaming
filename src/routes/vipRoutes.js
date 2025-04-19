const express = require('express');
const router = express.Router();
const vipController = require('../controllers/vipController');
const { authenticate } = require('../middleware/auth');

// All VIP routes require authentication
router.use(authenticate);

// VIP routes
router.post('/subscribe', vipController.subscribe);
router.get('/status', vipController.getStatus);
router.post('/cancel', vipController.cancel);

module.exports = router; 
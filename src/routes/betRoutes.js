const express = require('express');
const router = express.Router();
const betController = require('../controllers/betController');
const { authenticate, isAdmin } = require('../middleware/auth');

// All bet routes require authentication
router.use(authenticate);

// Bet routes
router.post('/place', betController.placeBet);
router.get('/history', betController.getBetHistory);
router.get('/:id', betController.getBet);

// Admin-only routes
router.post('/settle/:id', isAdmin, betController.settleBet);

module.exports = router; 
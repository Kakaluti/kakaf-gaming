const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
// const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Load environment variables
dotenv.config();

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '..', 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// Initialize Express app
const app = express();

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Security headers middleware
app.use((req, res, next) => {
  // Restrict CORS to specific domains
  const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',');
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');
  
  // Enforce HTTPS
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  
  // Prevent MIME-type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // Prevent XSS attacks
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Referrer Policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Permissions Policy
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  
  next();
});

// CORS configuration
app.use(cors({ origin: '*' }));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Root route handler - Moved before other routes
app.get('/', (req, res) => {
  console.log('Root route accessed');
  res.json({
    message: 'Welcome to KAKAF-GAMING API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      wallet: '/api/wallet',
      bet: '/api/bet',
      vip: '/api/vip',
      twoFactor: '/api/2fa'
    },
    documentation: 'https://github.com/Kakaluti/kakaf-gaming#readme'
  });
});

// API Routes
const authRoutes = require('./routes/authRoutes');
const walletRoutes = require('./routes/walletRoutes');
const betRoutes = require('./routes/betRoutes');
const vipRoutes = require('./routes/vipRoutes');
const twoFactorRoutes = require('./routes/twoFactorRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/bet', betRoutes);
app.use('/api/vip', vipRoutes);
app.use('/api/2fa', twoFactorRoutes);

// 404 handler
app.use((req, res) => {
  console.log('404 - Route not found:', req.path);
  res.status(404).json({
    error: 'Not Found',
    message: `The route ${req.path} does not exist`,
    availableRoutes: ['/', '/api/auth', '/api/wallet', '/api/bet', '/api/vip', '/api/2fa']
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: 'Something went wrong!',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} to test the API`);
}); 
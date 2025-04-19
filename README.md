# KAKAF-GAMING

A gaming betting platform with user authentication, wallet management, betting functionality, and VIP subscriptions.

## Features

- User authentication (register, login, password reset)
- Two-factor authentication (2FA)
- Wallet management (deposit, withdraw, balance)
- Betting system with 5% rake on winnings
- VIP subscription ($10/month)
- Admin functionality
- Rate limiting and security measures

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Redis (optional, for caching)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/kakaf-gaming.git
cd kakaf-gaming
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
# Server Configuration
PORT=3000
NODE_ENV=development
APP_URL=http://localhost:3000

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/kakaf-gaming

# JWT Configuration
JWT_SECRET=your_jwt_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Firebase Configuration
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-client-email

# Redis Configuration
REDIS_URL=redis://localhost:6379

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
LOG_FILE_PATH=logs/app.log
ERROR_LOG_FILE_PATH=logs/error.log

# Security
SESSION_SECRET=your_session_secret
COOKIE_SECRET=your_cookie_secret
```

4. Start the server:
```bash
npm start
```

## API Endpoints

### Authentication
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login user
- POST /api/auth/refresh-token - Refresh JWT token
- POST /api/auth/forgot-password - Request password reset
- POST /api/auth/reset-password - Reset password
- GET /api/auth/me - Get current user info

### Wallet
- POST /api/wallet/deposit - Deposit funds (6% fee)
- POST /api/wallet/withdraw - Withdraw funds (6% fee)
- GET /api/wallet/balance - Get current balance
- GET /api/wallet/transactions - Get transaction history

### Betting
- POST /api/bet/place - Place a bet
- GET /api/bet/history - Get bet history
- GET /api/bet/:id - Get bet details
- POST /api/bet/settle/:id - Settle bet (admin only)

### VIP
- POST /api/vip/subscribe - Subscribe to VIP ($10/month)
- GET /api/vip/status - Get VIP status
- POST /api/vip/cancel - Cancel VIP subscription

### 2FA
- POST /api/2fa/request - Request 2FA code (admin only)
- POST /api/2fa/verify - Verify 2FA code (admin only)

## Security Features

- JWT authentication
- Password hashing with bcrypt
- Rate limiting
- CORS protection
- Input validation
- Error handling
- Logging

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License. 
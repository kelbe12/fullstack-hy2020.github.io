const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
require('dotenv').config();

const app = express();

// Middleware
app.use(helmet());
app.use(compression());
app.use(morgan('combined'));
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-domain.com', 'https://admin.your-domain.com']
    : ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Test routes (without database)
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Multivendor Marketplace API is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    note: 'MongoDB connection disabled for testing'
  });
});

// Mock auth routes
app.post('/api/auth/register', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Registration endpoint working (MongoDB required for full functionality)',
    receivedData: {
      email: req.body.email,
      firstName: req.body.firstName,
      lastName: req.body.lastName
    }
  });
});

app.post('/api/auth/login', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Login endpoint working (MongoDB required for full functionality)',
    receivedData: {
      email: req.body.email
    }
  });
});

// Mock other routes
app.get('/api/products', (req, res) => {
  res.json({
    status: 'success',
    message: 'Products endpoint working',
    data: [
      { id: 1, name: 'Sample Product 1', price: 29.99 },
      { id: 2, name: 'Sample Product 2', price: 49.99 }
    ]
  });
});

app.get('/api/vendors', (req, res) => {
  res.json({
    status: 'success',
    message: 'Vendors endpoint working',
    data: [
      { id: 1, name: 'Sample Vendor 1', rating: 4.5 },
      { id: 2, name: 'Sample Vendor 2', rating: 4.8 }
    ]
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    status: 'error',
    message: 'Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Multivendor Marketplace API (Test Mode) running on port ${PORT}`);
  console.log(`📱 Environment: ${process.env.NODE_ENV}`);
  console.log(`⚠️  Note: MongoDB connection disabled for testing`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;
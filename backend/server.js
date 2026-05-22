const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
app.use(cors());

// Parse incoming JSON requests
app.use(express.json());

// Main welcome route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Flipkart Clone API Server!',
    version: '1.0.0',
    status: 'Running'
  });
});

// Import route modules
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders');
const wishlistRoutes = require('./routes/wishlist');
const paymentRoutes = require('./routes/payments');

// Bind routers to API namespaces
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/payments', paymentRoutes);

// Global 404 Route handler
app.use((req, res, next) => {
  res.status(404).json({ message: 'Requested API endpoint not found' });
});

// Global central Error Handler middleware
app.use((err, req, res, next) => {
  console.error("Unhandle Server Error:", err.stack);
  res.status(500).json({
    message: 'Something went wrong inside the server!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// Spin up server listener
const server = app.listen(PORT, () => {
  console.log(`================================================================`);
  console.log(`🚀 Flipkart Clone Backend Server running in ${process.env.NODE_ENV} mode`);
  console.log(`🌐 API Gateway Local Address: http://localhost:${PORT}`);
  console.log(`================================================================`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use.`);
    console.error(`Stop the existing process or start this server with another port, for example: $env:PORT=5001; npm start`);
    process.exit(1);
  }

  console.error('Server failed to start:', err);
  process.exit(1);
});

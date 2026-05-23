const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const authMiddleware = require('./middleware/authMiddleware');
const paymentController = require('./controllers/paymentController');

const corsOptions = {
  origin(origin, callback) {
    return callback(null, origin || true);
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());

app.get('/', (_req, res) => {
  res.json({ message: 'Flipkart API is running' });
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/wishlist', require('./routes/wishlist'));
app.use('/api/payments', require('./routes/payments'));
app.post('/api/create-order', authMiddleware, paymentController.createRazorpayOrder);
app.post('/api/verify-payment', authMiddleware, paymentController.verifyRazorpayPayment);

app.use((_req, res) => {
  res.status(404).json({ message: 'API endpoint not found' });
});

app.use((err, _req, res, _next) => {
  console.error('Server error:', err);
  res.status(500).json({
    message: 'Something went wrong',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const server = app.listen(PORT, () => {
  console.log(`Flipkart API running on http://localhost:${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use.`);
    process.exit(1);
  }

  console.error('Server failed to start:', err);
  process.exit(1);
});

require('dotenv').config();

const express        = require('express');
const cors           = require('cors');
const { initRedis }  = require('./config/redis');

const bookingRoutes  = require('./routes/bookingRoutes');
const partnerRoutes  = require('./routes/partnerRoutes');
const paymentRoutes  = require('./routes/paymentRoutes');

const app  = express();
const PORT = process.env.PORT || 5000;

// Middleware 
app.use(cors());
app.use(express.json());

// Routes 
app.use('/api', bookingRoutes);
app.use('/api', partnerRoutes);
app.use('/api', paymentRoutes);

// Health check 
app.get('/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date() }));

// 404 handler 
app.use((_req, res) => res.status(404).json({ error: 'Route not found' }));

// Global error handler 
app.use((err, _req, res, _next) => {
  console.error('[Unhandled Error]', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Startup
const start = async () => {
  await initRedis();

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n🚀 Server running on http://localhost:${PORT}`);
    console.log(`   ENV: ${process.env.NODE_ENV || 'development'}\n`);
  });
};

start();
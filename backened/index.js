require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import router BEFORE creating app
const generateRouter = require('./routers/AIRouter');

const app = express();

// Middleware - MUST be before routes
app.use(cors());
app.use(express.json({ limit: '500kb' }));
app.use(express.urlencoded({ limit: '500kb', extended: true }));

// Debug logging
app.use((req, res, next) => {
  console.log(`📍 ${new Date().toLocaleTimeString()} ${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/', (req, res) => {
  res.json({ message: '✅ Snap-UI backend running' });
});

// MongoDB connection
const mongoUri = process.env.MONGODB_URI;
if (mongoUri) {
  mongoose.connect(mongoUri)
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => console.error('❌ MongoDB Error:', err.message));
} else {
  console.warn('⚠️  MONGODB_URI not set');
}

// IMPORTANT: Mount router BEFORE 404 handler
console.log('📌 Mounting generateRouter at /api...');
app.use('/api', generateRouter);

// Debug: List all registered routes
console.log('📌 Registered routes:');

// Test route to verify mounting
app.get('/api/test', (req, res) => {
  res.json({ message: '✅ API router mounted successfully!' });
});

// 404 handler - MUST be LAST
app.use((req, res) => {
  console.log(`❌ 404 Not Found: ${req.method} ${req.path}`);
  res.status(404).json({ error: 'Route not found', path: req.path });
});

// Error handler - MUST be LAST
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err);
  res.status(500).json({ error: err.message || 'Server error' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`\n${'='.repeat(50)}`);
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`✅ API endpoint: http://localhost:${PORT}/api/generate`);
  console.log(`${'='.repeat(50)}\n`);
});
app._router.stack.forEach((middleware) => {
  if (middleware.route) {
    console.log(`  ${Object.keys(middleware.route.methods)[0].toUpperCase()} ${middleware.route.path}`);
  } else if (middleware.name === 'router') {
    console.log(`  /api/* (mounted router)`);
  }
});

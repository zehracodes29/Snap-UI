require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const generateRouter = require('./routers/AIRouter');

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '500kb' }));

// Debug: Log all incoming requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Healthcheck
app.get('/', (req, res) => res.send('Snap-UI backend running'));

// MongoDB connection
const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
  console.error('MONGODB_URI is not set in environment');
} else {
  mongoose.connect(mongoUri)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => {
      console.error('MongoDB Connection Error:', err);
    });
}

// Routes - Mount AIRouter at /api
console.log('Mounting generateRouter at /api');
app.use('/api', generateRouter);

// Fallback 404 JSON
app.use((req, res) => {
  console.log('404 - Route not found:', req.method, req.path);
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Server error' });
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
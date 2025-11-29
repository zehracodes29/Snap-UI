// backened/server.js
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const projectsRouter = require('./routers/Project');
const generatedRouter = require('./routers/AIRouter');
const generateRouter = require('./routers/Generated');

const app = express();

// Middleware
app.use(cors()); // in production set specific origin
app.use(express.json({ limit: '500kb' }));

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
      // optional: process.exit(1);
    });
}

// Routes
// Projects router -> mounted at /api/projects
app.use('/api/projects', projectsRouter);

// If AIRouter/Generated routers define routes like '/:id/generated' etc.
// mounting at /api/projects turns them into /api/projects/:id/generated
app.use('/api/projects', generatedRouter);

// Generation endpoints (separate)
app.use('/api/generate', generateRouter);

// Fallback 404 JSON
app.use((req, res) => res.status(404).json({ error: 'Not found' }));

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Server error' });
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

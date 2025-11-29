// backend/server.js
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const projectsRouter = require('./routers/Project');
const generatedRouter = require('./routers/AIRouter');
const generateRouter = require('./routers/Generated');

const app = express();

// Middleware
app.use(cors()); // in production, replace with cors({ origin: 'https://yourdomain.com' })
app.use(express.json({ limit: '500kb' })); // replaces body-parser

// Basic health route
app.get('/', (req, res) => res.send('Snap-UI backend running'));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => {
    console.error('MongoDB Connection Error:', err);
    // Optional: exit process if DB is required for the app to run
    // process.exit(1);
  });

// Routes
// Projects router handles /api/projects (list, create, update, etc.)
app.use('/api/projects', projectsRouter);

// If generatedRouter expects routes like /api/projects/:id/generated
// and is defined with router.route('/:id/generated') inside, mounting at /api/projects is correct.
app.use('/api/projects', generatedRouter);

// Generation endpoint (separate)
app.use('/api/generate', generateRouter);

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

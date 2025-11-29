// backend/server.js
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const projectsRouter = require('./routers/project');
const generatedRouter = require('./routers/AIRouter');
const generateRouter = require('./routers/Generated');
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors()); // adjust origin in production
app.use(bodyParser.json({ limit: '500kb' }));

app.use('/api/projects', projectsRouter);
// note: generated route uses /api/projects/:id/generated via generatedRouter (it expects :id in path)
app.use('/api/projects', generatedRouter);

// generation endpoint
app.use('/api/generate', generateRouter);

app.get('/', (req, res) => res.send('Snap-UI backend running'));
app.listen(PORT, () => console.log(`Backend listening on ${PORT}`));

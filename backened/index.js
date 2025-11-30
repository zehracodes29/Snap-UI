require('dotenv').config();

const path = require('path');
const express = require('express');
const cors = require('cors');

// Create the express app EARLY (avoid "use before init" errors)
const app = express();
const port = process.env.PORT || 4000;

// helper safeRequire (optional)
function safeRequire(relPath, name) {
  try {
    const resolved = require.resolve(relPath, { paths: [process.cwd()] });
    console.log(`Resolved ${name} from: ${resolved}`);
    return require(resolved);
  } catch (err) {
    console.warn(`Could not require ${name} at ${relPath}: ${err.message}`);
    return null;
  }
}

/* ---------- Basic middleware ---------- */

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// CORS + JSON parsing
app.use(cors({
  origin: process.env.FRONTEND_ORIGIN || "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));
app.use(express.json());

/* ---------- Load routers safely ---------- */

// Try to load generate / ai router at common paths
let generateRouter = safeRequire('./routers/AiRouter', 'AiRouter') ||
                     safeRequire('./src/routers/AiRouter', 'AiRouter') ||
                     safeRequire('./src/routes/generate', 'generate');

// Mount generate router if found (mount BEFORE catch-alls)
if (generateRouter) {
  app.use('/user/ai', generateRouter); // routes: /user/ai/generate etc.
  console.log('Mounted /user/ai');
} else {
  console.warn('AiRouter not found. Skipping /user/ai mount.');
}

// Other routers (try multiple locations)
const UserRouter = safeRequire('./routers/Userrouter', 'UserRouter') || safeRequire('./src/routers/Userrouter', 'UserRouter');
const ProjectRouter = safeRequire('./routers/Projectrouter', 'ProjectRouter') || safeRequire('./src/routers/Projectrouter', 'ProjectRouter');
const AIRouter = safeRequire('./routers/AIRouter', 'AIRouter') || safeRequire('./src/routers/AIRouter', 'AIRouter');

// Mount if available
if (UserRouter) { app.use('/user', UserRouter); console.log('Mounted /user'); }
if (ProjectRouter) { app.use('/project', ProjectRouter); console.log('Mounted /project'); }
if (AIRouter) { app.use('/ai', AIRouter); console.log('Mounted /ai'); }

/* ---------- Root and error handling ---------- */

app.get('/', (req, res) => res.send('response from express'));

// Global error handlers (keeps nodemon from silently crashing)
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION:', err && err.stack ? err.stack : err);
});
process.on('unhandledRejection', (reason, p) => {
  console.error('UNHANDLED REJECTION at:', p, 'reason:', reason && reason.stack ? reason.stack : reason);
});

/* ---------- Start server ---------- */
app.listen(port, () => {
  console.log(`Express server started on port ${port}`);
});

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

// Route imports
const authRoutes = require('./routes/authroutes');
const userRoutes = require('./routes/userroutes');
const densityRoutes = require('./routes/densityroutes');
const pollutionRoutes = require('./routes/pollutionroutes');
const coralRoutes = require('./routes/coralroutes');
const speciesRoutes = require('./routes/speciesroutes');
const reportRoutes = require('./routes/reportroutes');

// Error handler
const errorHandler = require('./middleware/errormiddleware');

const app = express();

// Allow an explicit comma-separated allowlist. Vercel preview URLs for this
// project are also allowed so preview deployments can call the API.
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (!origin) return callback(null, true); // curl / server-to-server
    const isConfigured = allowedOrigins.includes(origin);
    const isReefwatchVercelPreview =
      /^https:\/\/reefwatch[^/]*\.vercel\.app$/i.test(origin);

    if (isConfigured || isReefwatchVercelPreview) return callback(null, true);
    return callback(new Error('Origin is not allowed by Reefwatch CORS policy'));
  },
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically (if using local disk storage)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// The CSV-backed pollution map does not need MongoDB. Other features (accounts,
// saved scans, reports) do; configure MONGO_URI to enable those features.
if (process.env.MONGO_URI) {
  connectDB();
} else {
  console.warn('[Database] MONGO_URI is not set; database-backed routes are disabled.');
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/density', densityRoutes);
app.use('/api/pollution', pollutionRoutes);
app.use('/api/coral', coralRoutes);
app.use('/api/species', speciesRoutes);
app.use('/api/reports', reportRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Reefwatch API is running',
    env: process.env.NODE_ENV,
    databaseConfigured: Boolean(process.env.MONGO_URI),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`[Server] Reefwatch API running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
});

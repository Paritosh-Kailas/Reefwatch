require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const densityRoutes = require('./routes/densityroutes');
const pollutionRoutes = require('./routes/pollutionroutes');

const app = express();

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());

// Initialize DB Connection
connectDB();

// Routes
app.use('/api/density', densityRoutes);
app.use('/api/pollution', pollutionRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Reefwatch server is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`[Server] Reefwatch server listening on port ${PORT}`);
});

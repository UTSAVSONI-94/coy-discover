const express = require('express');
const cors = require('cors');
const config = require('./src/config/env');
const healthRoutes = require('./src/routes/healthRoutes');
const feedRoutes = require('./src/routes/feedRoutes');
const swipeRoutes = require('./src/routes/swipeRoutes');
const matchRoutes = require('./src/routes/matchRoutes');
const errorHandler = require('./src/middleware/errorHandler');

const app = express();

// Middleware
app.use(cors({
  origin: config.corsOrigin,
  credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api', healthRoutes);
app.use('/api', feedRoutes);
app.use('/api', swipeRoutes);
app.use('/api', matchRoutes);

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  });
});

// Centralized error handling middleware
app.use(errorHandler);

// Start server
const server = app.listen(config.port, () => {
  console.log(`[Coy Backend] Running on http://localhost:${config.port}`);
  console.log(`[Coy Backend] Allowed CORS Origin: ${config.corsOrigin}`);
});

module.exports = { app, server };

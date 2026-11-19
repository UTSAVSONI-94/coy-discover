const express = require('express');
const cors = require('cors');
const config = require('./src/config/env');
const healthRoutes = require('./src/routes/healthRoutes');
const feedRoutes = require('./src/routes/feedRoutes');
const swipeRoutes = require('./src/routes/swipeRoutes');
const matchRoutes = require('./src/routes/matchRoutes');
const errorHandler = require('./src/middleware/errorHandler');

const app = express();

app.use(cors({
  origin: config.corsOrigin,
  credentials: true,
}));
app.use(express.json());

app.use('/api', healthRoutes);
app.use('/api', feedRoutes);
app.use('/api', swipeRoutes);
app.use('/api', matchRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  });
});

app.use(errorHandler);

const server = app.listen(config.port, () => {
  console.log(`Server listening on http://localhost:${config.port}`);
});

module.exports = { app, server };

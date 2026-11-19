const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const config = {
  port: parseInt(process.env.PORT, 10) || 5001,
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  dbPath: process.env.DB_PATH || path.resolve(__dirname, '../database/coy.db'),
  nodeEnv: process.env.NODE_ENV || 'development',
};

module.exports = config;

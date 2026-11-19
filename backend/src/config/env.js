const path = require('path');
const dotenv = require('dotenv');

const backendRoot = path.resolve(__dirname, '../../');
dotenv.config({ path: path.join(backendRoot, '.env') });

const rawDbPath = process.env.DB_PATH || 'src/database/coy.db';
const resolvedDbPath = path.isAbsolute(rawDbPath)
  ? rawDbPath
  : path.resolve(backendRoot, rawDbPath);

const config = {
  port: parseInt(process.env.PORT, 10) || 5001,
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  dbPath: resolvedDbPath,
  nodeEnv: process.env.NODE_ENV || 'development',
};

module.exports = config;

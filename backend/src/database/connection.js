const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');
const config = require('../config/env');

// Ensure database directory exists
const dbDir = path.dirname(config.dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Initialize SQLite connection
const db = new Database(config.dbPath);

// Enable foreign keys and Write-Ahead Logging for high performance & durability
db.pragma('foreign_keys = ON');
db.pragma('journal_mode = WAL');

// Execute schema to ensure tables and indexes are ready
const schemaPath = path.resolve(__dirname, 'schema.sql');
const schemaSql = fs.readFileSync(schemaPath, 'utf8');
db.exec(schemaSql);

module.exports = db;


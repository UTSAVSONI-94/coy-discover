const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');
const config = require('../config/env');

const dbDir = path.dirname(config.dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(config.dbPath);

db.pragma('foreign_keys = ON');
db.pragma('journal_mode = WAL');

const schemaSql = fs.readFileSync(path.resolve(__dirname, 'schema.sql'), 'utf8');
db.exec(schemaSql);

module.exports = db;

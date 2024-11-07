const path = require('path');
const dotenv = require('dotenv');

const envPath = path.resolve(__dirname, '../..', '.env.db');

const result = dotenv.config({ path: envPath });

if (result.error) {
  console.error('Failed to load .env.db file:', result.error);
  throw result.error;
}

module.exports = { databaseUrl: process.env.DATABASE_URL };
  
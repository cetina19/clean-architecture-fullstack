const { Pool } = require('pg');
const config = require('../../config/config');

const pool = new Pool({
  connectionString: config.databaseUrl,
  /*ssl: {
    rejectUnauthorized: false,
  },
 */
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  getClient: () => pool.connect(),
};

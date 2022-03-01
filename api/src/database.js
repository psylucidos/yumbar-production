const { Pool } = require('pg');

const pool = new Pool();

module.exports = {
  query: (text, params, callback) => {
    const start = Date.now();
    return pool.query(text, params, (err, res) => {
      const duration = Date.now() - start;
      if (!err) {
        console.log('executed query', { text, duration, rows: res.rowCount });
      } else {
        console.log('executed query with error', { text, duration });
      }
      callback(err, res);
    });
  },
};
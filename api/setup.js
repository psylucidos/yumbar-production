require('dotenv').config();

const fs = require('fs');
const db = require('./src/database');

const setupQuery = fs.readFileSync('./dbsetup.sql', { encoding: 'utf8', flag: 'r' });

console.log('Setting up database tables...');
db.query(setupQuery, [], (err, res) => {
  if (err) {
    throw err;
  } else {
    console.log(res.rows);
  }
});

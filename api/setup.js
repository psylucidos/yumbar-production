require('dotenv').config();

const fs = require('fs');
const db = require('./src/database');

const setupQuery = fs.readFileSync('./dbsetup.sql', { encoding: 'utf8', flag: 'r' });
const clearQuery = fs.readFileSync('./cleardb.sql', { encoding: 'utf8', flag: 'r' });

console.log('Clearing database tables...');
db.query(clearQuery, [], (clearErr, clearRes) => {
  if (clearErr) {
    throw clearErr;
  } else {
    console.log(clearRes.rows);
    console.log('Setting up database tables...');
    db.query(setupQuery, [], (err, res) => {
      if (err) {
        throw err;
      } else {
        console.log(res.rows);
      }
    });
  }
});

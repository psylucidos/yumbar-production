require('dotenv').config();

const fs = require('fs');
const db = require('./src/database');

const setupQuery = fs.readFileSync('./dbsetup.sql', { encoding: 'utf8', flag: 'r' });
const clearQuery = fs.readFileSync('./cleardb.sql', { encoding: 'utf8', flag: 'r' });

console.log('Clearing database tables...');
db.query(clearQuery, [], (clearErr, clearRes) => {
  console.log(clearRes);
  console.log('Setting up database tables...');
  db.query(setupQuery, [], (err, res) => {
    if (err) {
      console.log('Looks like table(s) already exist!');
    } else {
      console.log('Created tables!');
      console.log(res.rows);
    }
  });

  if (clearErr) {
    console.log('Looks like tables dont exist, oh well, it tried.');
  }
});

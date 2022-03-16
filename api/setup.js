require('dotenv').config();

const fs = require('fs');
const db = require('./src/database');
const { register } = require('./src/controllers/auth');

const setupQuery = fs.readFileSync('./dbsetup.sql', { encoding: 'utf8', flag: 'r' });
const clearQuery = fs.readFileSync('./cleardb.sql', { encoding: 'utf8', flag: 'r' });

console.log(' -- REMEMBER TO SET DATESTYLE TO DMY IN CONFIG! --');
console.log('Clearing database tables...');
db.query(clearQuery, [], (clearErr) => {
  if (clearErr) {
    console.log('Looks like tables dont exist, oh well, it tried.');
    console.error(clearErr);
  }

  console.log('Setting up database tables...');
  db.query(setupQuery, [], (err) => {
    if (err) {
      console.log('Looks like table(s) already exist!');
      console.error(err);
    } else {
      console.log('Created tables!');
      console.log('Creating user..');
      if (process.argv.length === 4) {
        console.log('Registering user', process.argv[2], String(process.argv[3]).trim());
        const authRes = register(process.argv[2], String(process.argv[3]).trim());
        console.log(authRes);
        console.log('DONE!');
      } else {
        console.log('!! Incorrect amount of args supplied, please use: > node setup.js USERNAME PASSWORD');
      }
    }
  });
});

require('dotenv').config();

const { scryptSync, randomBytes, timingSafeEqual } = require('crypto');
const db = require('../database');

module.exports = {
  login: (username, password) => new Promise((resolve, reject) => {
    db.query('SELECT * FROM yumbarusers WHERE username = $1;', [username], (err, res) => {
      if (err) {
        reject(500, err);
      } else if (res.rows[0]) {
        const targetUser = res.rows[0];

        const [salt, key] = targetUser.password.split(':');
        const hashedBuffer = scryptSync(password, salt, 64);
        const keyBuffer = Buffer.from(key, 'hex');
        const match = timingSafeEqual(hashedBuffer, keyBuffer);

        if (match) {
          resolve(200);
        } else {
          reject(401);
        }
      } else {
        reject(404);
      }
    });
  }),

  register: (newUsername, newPassword) => new Promise((resolve, reject) => {
    const salt = randomBytes(16).toString('hex');
    const hashedPassword = scryptSync(newPassword, salt, 64).toString('hex');
    const userPassword = `${salt}:${hashedPassword}`;

    db.query('INSERT INTO yumbarusers(username, password) VALUES($1, $2) RETURNING *;', [newUsername, userPassword], (err, res) => {
      if (err) {
        reject(500, err);
      } else if (res.rows[0]) {
        resolve(200, res.rows[0]);
      } else {
        rsolve(401);
      }
    });
  }),
};

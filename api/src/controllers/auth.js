const { scryptSync, randomBytes, timingSafeEqual } = require('crypto');
const db = require('../database');

module.exports = {
  login: (username, password) => new Promise((resolve, reject) => {
    db.query('SELECT * FROM yumbarusers WHERE username = $1;', [username], (err, res) => {
      if (err) {
        reject(err);
      } else if (res.rows[0]) {
        const targetUser = res.rows[0];

        const [salt, key] = targetUser.password.split(':');
        const hashedBuffer = scryptSync(password, salt, 64);
        const keyBuffer = Buffer.from(key, 'hex');
        const match = timingSafeEqual(hashedBuffer, keyBuffer);

        if (match) {
          resolve(200);
        } else {
          resolve(401);
        }
      } else {
        resolve(404);
      }
    });
  }),

  register: (newUsername, newPassword) => new Promise((resolve, reject) => {
    const salt = randomBytes(16).toString('hex');
    const hashedPassword = scryptSync(newPassword, salt, 64).toString('hex');
    const userPassword = `${salt}:${hashedPassword}`;

    // TODO: See if better query exists
    db.query('SELECT * FROM yumbarusers WHERE username = $1;', [newUsername], (selectErr, selectRes) => {
      if (selectErr) {
        reject(selectErr);
      } else if (selectRes.rows[0]) {
        resolve(401);
      } else {
        db.query('INSERT INTO yumbarusers(username, password) VALUES($1, $2) RETURNING *;', [newUsername, userPassword], (err, res) => {
          if (err) {
            reject(err);
          } else if (res.rows[0]) {
            resolve(200);
          } else {
            resolve(new Error('User not registered!'));
          }
        });
      }
    });
  }),
};

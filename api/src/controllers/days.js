const db = require('../database');

module.exports = {
  addDay: (date, productionType) => new Promise((resolve, reject) => {
    // TODO: check if day exists then return 401 if it does
    db.query('INSERT INTO productiondays(productiondate, productiontype) VALUES($1, $2) RETURNING *;', [date, productionType], (err, res) => {
      if (err) {
        reject(err);
      } else if (res.rows[0]) {
        resolve(200, res.rows[0]);
      } else {
        resolve(new Error('Day not added!'));
      }
    });
  }),

  getDay: (date) => new Promise((resolve, reject) => {
    db.query('SELECT * FROM days WHERE date=$1;', [date], (err, res) => {
      if (err) {
        reject(err);
      } else if (res.rows[0]) {
        resolve(200, res.rows[0]);
      } else {
        resolve(200, undefined);
      }
    });
  }),
};

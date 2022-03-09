const db = require('../database');

module.exports = {
  addDay: (date, productionType) => new Promise((resolve, reject) => {
    // TODO: check if day exists then return 401 if it does
    // TODO: append production type to day model
    db.query('INSERT INTO productiondays(productiondate, productiontype) VALUES($1, $2) RETURNING *;', [date, productionType], (err, res) => {
      if (err) {
        reject(err);
      } else if (res.rows[0]) {
        resolve(res.rows[0]);
      } else {
        reject(new Error('Day not added!'));
      }
    });
  }),

  getDay: (date) => new Promise((resolve, reject) => {
    db.query('SELECT * FROM productiondays WHERE productiondate=$1;', [date], (err, res) => {
      if (err) {
        reject(err);
      } else if (res.rows[0]) {
        resolve(res.rows[0]);
      } else {
        resolve(404);
      }
    });
  }),
};

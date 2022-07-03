const db = require('../database');

module.exports = {
  addStaffEntry: (date, staffEntryData) => new Promise((resolve, reject) => {
    db.query(
      'INSERT INTO staffentries(productiondate, name, starttime, endtime, breaklength) VALUES($1, $2, $3, $4, $5) RETURNING *;',
      [
        date,
        staffEntryData.name,
        staffEntryData.starttime,
        staffEntryData.endtime,
        staffEntryData.breaklength,
      ],
      (err, res) => {
        if (err) {
          reject(err);
        } else if (res.rows[0]) {
          resolve(res.rows[0]);
        } else {
          reject(new Error('Staff entry not added!'));
        }
      },
    );
  }),

  updateStaffEntry: (id, staffEntryData) => new Promise((resolve, reject) => {
    db.query(
      'UPDATE staffentries SET name=$2, starttime=$3, endtime=$4, breaklength=$5 WHERE id=$1;',
      [
        id,
        staffEntryData.name,
        staffEntryData.starttime,
        staffEntryData.endtime,
        staffEntryData.breaklength,
      ],
      (err, res) => {
        console.log('updated staff', err, res);
        if (err) {
          reject(err);
        } else if (res.rowCount === 1) {
          resolve(200);
        } else {
          resolve(404);
        }
      },
    );
  }),

  deleteStaffEntry: (id) => new Promise((resolve, reject) => {
    db.query(
      'DELETE FROM staffentries WHERE id=$1;',
      [id],
      (err, res) => {
        if (err) {
          reject(err);
        } else if (res.rows) {
          resolve(200);
        } else {
          resolve(404);
        }
      },
    );
  }),

  getStaffEntries: (date) => new Promise((resolve, reject) => {
    db.query('SELECT * FROM staffentries WHERE productiondate=$1;', [date], (err, res) => {
      if (err) {
        reject(err);
      } else if (res.rows) {
        resolve(res.rows);
      } else {
        reject(new Error('Unable to get staff entries!'));
      }
    });
  }),

  // SELECT SUM(breaklength), array_agg(endtime), array_agg(starttime),
  // endtime::time - starttime::time AS duration, array_agg(productiondate) FROM
  // staffentries WHERE productiondate BETWEEN $1 AND $2 GROUP BY name ORDER BY name;
  getStaffEntriesInRange: (startDate, endDate) => new Promise((resolve, reject) => {
    db.query('SELECT *, endtime::time - starttime::time AS duration FROM staffentries WHERE productiondate BETWEEN $1 AND $2;', [startDate, endDate], (err, res) => {
      if (err) {
        reject(err);
      } else if (res.rows) {
        resolve(res.rows);
      } else {
        reject(new Error('Unable to find staff entries!'));
      }
    });
  }),
};

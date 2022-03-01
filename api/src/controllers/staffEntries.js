const db = require('../database');

module.exports = {
  addStaffEntry: (date, staffEntryData) => new Promise((resolve, reject) => {
    db.query(
      'INSERT INTO staffentries(productiondate, name, starttime, endtime, breaklength) VALUES($1, $2, $3, $4, $5) RETURNING *;',
      [
        date,
        staffEntryData.name,
        staffEntryData.startTime,
        staffEntryData.endTime,
        staffEntryData.breakLength,
      ],
      (err, res) => {
        if (err) {
          reject(err);
        } else if (res.rows[0]) {
          resolve(200, res.rows[0]);
        } else {
          resolve(new Error('Staff entry not added!'));
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
        staffEntryData.startTime,
        staffEntryData.endTime,
        staffEntryData.breakLength,
      ],
      (err, res) => {
        if (err) {
          reject(err);
        } else if (res.rows[0]) {
          resolve(200, res.rows[0]);
        } else {
          resolve(new Error('Staff entry not updated!'));
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
        } else if (res.rows[0]) {
          resolve(200);
        } else {
          resolve(new Error('Staff entry not deleted!'));
        }
      },
    );
  }),

  getStaffEntries: (date) => new Promise((resolve, reject) => {
    db.query('SELECT * FROM staffentries WHERE date=$1;', [date], (err, res) => {
      if (err) {
        reject(err);
      } else if (res.rows) {
        resolve(200, res.rows);
      } else {
        resolve(200, undefined);
      }
    });
  }),
};

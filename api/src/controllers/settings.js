const db = require('../database');

// TODO: sanitise all sql queries!!

module.exports = {
  addStaffName: (name) => new Promise((resolve, reject) => {
    db.query(
      'INSERT INTO staffnames(name) VALUES($1) RETURNING *;',
      [name],
      (err, res) => {
        if (err) {
          reject(err);
        } else if (res.rows[0]) {
          resolve(res.rows[0]);
        } else {
          reject(new Error('Flavor entry not added!'));
        }
      },
    );
  }),

  getStaffNames: () => new Promise((resolve, reject) => {
    db.query('SELECT * FROM staffnames;', (err, res) => {
      if (err) {
        reject(err);
      } else if (res.rows) {
        resolve(res.rows);
      } else {
        reject(new Error('Unable to find staff names!'));
      }
    });
  }),

  deleteStaffName: (id) => new Promise((resolve, reject) => {
    db.query(
      'DELETE FROM staffnames WHERE id=$1;',
      [id],
      (err, res) => {
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

  addFlavourName: (name) => new Promise((resolve, reject) => {
    db.query(
      'INSERT INTO flavournames(name) VALUES($1) RETURNING *;',
      [name],
      (err, res) => {
        if (err) {
          reject(err);
        } else if (res.rows[0]) {
          resolve(res.rows[0]);
        } else {
          reject(new Error('Flavor entry not added!'));
        }
      },
    );
  }),

  getFlavourNames: () => new Promise((resolve, reject) => {
    db.query('SELECT * FROM flavournames;', (err, res) => {
      if (err) {
        reject(err);
      } else if (res.rows) {
        resolve(res.rows);
      } else {
        reject(new Error('Unable to find staff names!'));
      }
    });
  }),

  deleteFlavourName: (id) => new Promise((resolve, reject) => {
    db.query(
      'DELETE FROM flavournames WHERE id=$1;',
      [id],
      (err, res) => {
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
};

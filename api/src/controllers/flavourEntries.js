const db = require('../database');

module.exports = {
  addFlavorEntry: (date, productionType, flavourEntryData) => new Promise((resolve, reject) => {
    if (productionType === 'Cutting Day') {
      db.query(
        'INSERT INTO cuttingflavourentries(productiondate, flavour, slabbatch, basebatch, slabamount, boxamount, notes) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *;',
        [
          date,
          flavourEntryData.flavour,
          flavourEntryData.slabbatch,
          flavourEntryData.basebatch,
          flavourEntryData.slabamount,
          flavourEntryData.boxamount,
          flavourEntryData.notes,
        ],
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
    } else if (productionType === 'Packing Day') {
      db.query(
        'INSERT INTO packingflavourentries(productiondate, flavour, batchnumber, slabamount, boxamount, usebydate, sampleamount, notes) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;',
        [
          date,
          flavourEntryData.flavour,
          flavourEntryData.batchnumber,
          flavourEntryData.slabamount,
          flavourEntryData.boxamount,
          flavourEntryData.usebydate,
          flavourEntryData.sampleamount,
          flavourEntryData.notes,
        ],
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
    } else if (productionType === 'Base Day') {
      db.query(
        'INSERT INTO baseflavourentries(productiondate, flavour, blenderamount, batchnumber, smallamount, largeamount, smallcakeamount, mediumcakeamount, largecakeamount, notes) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *;',
        [
          date,
          flavourEntryData.flavour,
          flavourEntryData.blenderamount,
          flavourEntryData.batchnumber,
          flavourEntryData.smallamount,
          flavourEntryData.largeamount,
          flavourEntryData.smallcakeamount,
          flavourEntryData.mediumcakeamount,
          flavourEntryData.largecakeamount,
          flavourEntryData.notes,
        ],
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
    } else if (productionType === 'Ice Cream Day') {
      db.query(
        'INSERT INTO icecreamflavourentries(productiondate, flavour, batchnumber, jugsamount, traysamount, unsaleabletraysamount, notes) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *;',
        [
          date,
          flavourEntryData.flavour,
          flavourEntryData.batchnumber,
          flavourEntryData.jugsamount,
          flavourEntryData.traysamount,
          flavourEntryData.unsaleabletraysamount,
          flavourEntryData.notes,
        ],
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
    } else {
      reject(new Error('Unkown production day!'));
    }
  }),

  updateFlavorEntry: (id, productionType, flavourEntryData) => new Promise((resolve, reject) => {
    if (productionType === 'Cutting Day') {
      db.query(
        'UPDATE cuttingflavourentries SET flavour=$2, slabbatch=$3, basebatch=$4, slabamount=$5, boxamount=$6, notes=$7 WHERE id=$1;',
        [
          id,
          flavourEntryData.flavour,
          flavourEntryData.slabbatch,
          flavourEntryData.basebatch,
          flavourEntryData.slabamount,
          flavourEntryData.boxamount,
          flavourEntryData.notes,
        ],
        (err, res) => {
          if (err) {
            reject(err);
          } else if (res.rows.length === 0) {
            resolve(200);
          } else {
            resolve(404);
          }
        },
      );
    } else if (productionType === 'Packing Day') {
      db.query(
        'UPDATE packingflavourentries SET flavour=$2, batchnumber=$3, slabamount=$4, boxamount=$5, usebydate=$6, sampleamount=$7, notes=$8 WHERE id=$1;',
        [
          id,
          flavourEntryData.flavour,
          flavourEntryData.batchnumber,
          flavourEntryData.slabamount,
          flavourEntryData.boxamount,
          flavourEntryData.usebydate,
          flavourEntryData.sampleamount,
          flavourEntryData.notes,
        ],
        (err, res) => {
          if (err) {
            reject(err);
          } else if (res.rows.length === 0) {
            resolve(200);
          } else {
            resolve(404);
          }
        },
      );
    } else if (productionType === 'Base Day') {
      db.query(
        'UPDATE baseflavourentries SET flavour=$2, blenderamount=$3, batchnumber=$4, smallamount=$5, largeamount=$6, smallcakeamount=$7, mediumcakeamount=$8, largecakeamount=$9, notes=$10 WHERE id=$1;',
        [
          id,
          flavourEntryData.flavour,
          flavourEntryData.blenderamount,
          flavourEntryData.batchnumber,
          flavourEntryData.smallamount,
          flavourEntryData.largeamount,
          flavourEntryData.smallcakeamount,
          flavourEntryData.mediumcakeamount,
          flavourEntryData.largecakeamount,
          flavourEntryData.notes,
        ],
        (err, res) => {
          if (err) {
            reject(err);
          } else if (res.rows.length === 0) {
            resolve(200);
          } else {
            resolve(404);
          }
        },
      );
    } else if (productionType === 'Ice Cream Day') {
      db.query(
        'UPDATE icecreamflavourentries SET flavour=$2, batchnumber=$3, jugsamount=$4, traysamount=$5, unsaleabletraysamount=$6, notes=$7 WHERE id=$1',
        [
          id,
          flavourEntryData.flavour,
          flavourEntryData.batchnumber,
          flavourEntryData.jugsamount,
          flavourEntryData.traysamount,
          flavourEntryData.unsaleabletraysamount,
          flavourEntryData.notes,
        ],
        (err, res) => {
          if (err) {
            reject(err);
          } else if (res.rows.length === 0) {
            resolve(200);
          } else {
            resolve(404);
          }
        },
      );
    } else {
      reject(new Error('Unkown production day!'));
    }
  }),

  getFlavourEntries: (date, productionType) => new Promise((resolve, reject) => {
    if (productionType === 'Cutting Day') {
      db.query('SELECT * FROM cuttingflavourentries WHERE productiondate=$1;', [date], (err, res) => {
        if (err) {
          reject(err);
        } else if (res.rows) {
          resolve(res.rows);
        } else {
          reject(new Error('Unable to find flavour entries!'));
        }
      });
    } else if (productionType === 'Packing Day') {
      db.query('SELECT * FROM packingflavourentries WHERE productiondate=$1;', [date], (err, res) => {
        if (err) {
          reject(err);
        } else if (res.rows) {
          resolve(res.rows);
        } else {
          reject(new Error('Unable to find flavour entries!'));
        }
      });
    } else if (productionType === 'Base Day') {
      db.query('SELECT * FROM baseflavourentries WHERE productiondate=$1;', [date], (err, res) => {
        if (err) {
          reject(err);
        } else if (res.rows) {
          resolve(res.rows);
        } else {
          reject(new Error('Unable to find flavour entries!'));
        }
      });
    } else if (productionType === 'Ice Cream Day') {
      db.query('SELECT * FROM icecreamflavourentries WHERE productiondate=$1;', [date], (err, res) => {
        if (err) {
          reject(err);
        } else if (res.rows) {
          resolve(res.rows);
        } else {
          reject(new Error('Unable to find flavour entries!'));
        }
      });
    }
  }),

  deleteFlavorEntry: (id, productionType) => new Promise((resolve, reject) => {
    if (productionType === 'Cutting Day') {
      db.query(
        'DELETE FROM cuttingflavourentries WHERE id=$1;',
        [id],
        (err, res) => {
          if (err) {
            reject(err);
          } else if (res) {
            resolve(200);
          } else {
            resolve(404);
          }
        },
      );
    } else if (productionType === 'Packing Day') {
      db.query(
        'DELETE FROM packingflavourentries WHERE id=$1;',
        [id],
        (err, res) => {
          if (err) {
            reject(err);
          } else if (res) {
            resolve(200);
          } else {
            resolve(404);
          }
        },
      );
    } else if (productionType === 'Base Day') {
      db.query(
        'DELETE FROM baseflavourentries WHERE id=$1;',
        [id],
        (err, res) => {
          if (err) {
            reject(err);
          } else if (res) {
            resolve(200);
          } else {
            resolve(404);
          }
        },
      );
    } else if (productionType === 'Ice Cream Day') {
      db.query(
        'DELETE FROM icecreamflavourentries WHERE id=$1;',
        [id],
        (err, res) => {
          if (err) {
            reject(err);
          } else if (res) {
            resolve(200);
          } else {
            resolve(404);
          }
        },
      );
    }
    // TODO: handle no production type
  }),
};

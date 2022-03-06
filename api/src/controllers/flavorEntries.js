const db = require('../database');

module.exports = {
  addFlavorEntry: (date, productionType, flavourEntryData) => new Promise((resolve, reject) => {
    if (productionType === 'Cutting Day') {
      db.query(
        'INSERT INTO cuttingflavourentries(productiondate, flavor, slabbatch, basebatch, slabamount, boxamount, notes) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *;',
        [
          date,
          flavourEntryData.flavor,
          flavourEntryData.slabBatch,
          flavourEntryData.baseBatch,
          flavourEntryData.slabAmount,
          flavourEntryData.boxAmount,
          flavourEntryData.notes,
        ],
        (err, res) => {
          if (err) {
            reject(err);
          } else if (res.rows[0]) {
            resolve(200, res.rows[0]);
          } else {
            resolve(new Error('Flavor entry not added!'));
          }
        },
      );
    } else if (productionType === 'Packing Day') {
      db.query(
        'INSERT INTO packingflavourentries(productiondate, flavor, batchnumber, slabamount, boxamount, usebydate, sampleamount, notes) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;',
        [
          date,
          flavourEntryData.flavor,
          flavourEntryData.batchNumber,
          flavourEntryData.slabAmount,
          flavourEntryData.boxAmount,
          flavourEntryData.useByDate,
          flavourEntryData.sampleAmount,
          flavourEntryData.notes,
        ],
        (err, res) => {
          if (err) {
            reject(err);
          } else if (res.rows[0]) {
            resolve(200, res.rows[0]);
          } else {
            resolve(new Error('Flavor entry not added!'));
          }
        },
      );
    } else if (productionType === 'Base Day') {
      db.query(
        'INSERT INTO baseflavourentries(productiondate, flavor, blenderamount, batchnumber, smallamount, largeamount, smallcakeamount, mediumcakeamount, largecakeamount, notes) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *;',
        [
          date,
          flavourEntryData.flavor,
          flavourEntryData.blenderAmount,
          flavourEntryData.batchNumber,
          flavourEntryData.smallAmount,
          flavourEntryData.largeAmount,
          flavourEntryData.smallCakeAmount,
          flavourEntryData.mediumCakeAmount,
          flavourEntryData.largeCakeAmount,
          flavourEntryData.notes,
        ],
        (err, res) => {
          if (err) {
            reject(err);
          } else if (res.rows[0]) {
            resolve(200, res.rows[0]);
          } else {
            resolve(new Error('Flavor entry not added!'));
          }
        },
      );
    } else if (productionType === 'Ice Cream Day') {
      db.query(
        'INSERT INTO icecreamflavorentires(productiondate, flavor, blenderamount, batchnumber, smallamount, largeamount, smallcakeamount, mediumcakeamount, largecakeamount, notes) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *;',
        [
          date,
          flavourEntryData.flavor,
          flavourEntryData.batchNumber,
          flavourEntryData.jugsAmount,
          flavourEntryData.traysAmount,
          flavourEntryData.unsaleableTraysAmount,
          flavourEntryData.notes,
        ],
        (err, res) => {
          if (err) {
            reject(err);
          } else if (res.rows[0]) {
            resolve(200, res.rows[0]);
          } else {
            resolve(new Error('Flavor entry not added!'));
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
        'UPDATE cuttingflavourentries SET flavor=$2, slabbatch=$3, basebatch=$4, slabamount=$5, boxamount=$6, notes=$7 WHERE id=$1;',
        [
          id,
          flavourEntryData.flavor,
          flavourEntryData.slabBatch,
          flavourEntryData.baseBatch,
          flavourEntryData.slabAmount,
          flavourEntryData.boxAmount,
          flavourEntryData.notes,
        ],
        (err, res) => {
          if (err) {
            reject(err);
          } else if (res.rows[0]) {
            resolve(200, res.rows[0]);
          } else {
            resolve(new Error('Flavor entry not added!'));
          }
        },
      );
    } else if (productionType === 'Packing Day') {
      db.query(
        'UPDATE packingflavourentries SET flavor=$2, batchnumber=$3, slabamount=$4, boxamount=$5, usebydate=$6, sampleamount=$7, notes=$8 WHERE id=$1;',
        [
          id,
          flavourEntryData.flavor,
          flavourEntryData.batchNumber,
          flavourEntryData.slabAmount,
          flavourEntryData.boxAmount,
          flavourEntryData.useByDate,
          flavourEntryData.sampleAmount,
          flavourEntryData.notes,
        ],
        (err, res) => {
          if (err) {
            reject(err);
          } else if (res.rows[0]) {
            resolve(200, res.rows[0]);
          } else {
            resolve(new Error('Flavor entry not added!'));
          }
        },
      );
    } else if (productionType === 'Base Day') {
      db.query(
        'UPDATE baseflavourentries SET flavor=$2, blenderamount=$3, batchnumber=$4, smallamount=$5, largeamount=$6, smallcakeamount=$7, mediumcakeamount=$8, largecakeamount=$9, notes=$10 WHERE id=$1;',
        [
          id,
          flavourEntryData.flavor,
          flavourEntryData.blenderAmount,
          flavourEntryData.batchNumber,
          flavourEntryData.smallAmount,
          flavourEntryData.largeAmount,
          flavourEntryData.smallCakeAmount,
          flavourEntryData.mediumCakeAmount,
          flavourEntryData.largeCakeAmount,
          flavourEntryData.notes,
        ],
        (err, res) => {
          if (err) {
            reject(err);
          } else if (res.rows[0]) {
            resolve(200, res.rows[0]);
          } else {
            resolve(new Error('Flavor entry not added!'));
          }
        },
      );
    } else if (productionType === 'Ice Cream Day') {
      db.query(
        'UPDATE icecreamflavorentires SET flavor=$2, blenderamount=$3, batchnumber=$4, smallamount=$5, largeamount=$6, smallcakeamount=$7, mediumcakeamount=$8, largecakeamount=$9, notes=$10 WHERE id=$1',
        [
          id,
          flavourEntryData.flavor,
          flavourEntryData.batchNumber,
          flavourEntryData.jugsAmount,
          flavourEntryData.traysAmount,
          flavourEntryData.unsaleableTraysAmount,
          flavourEntryData.notes,
        ],
        (err, res) => {
          if (err) {
            reject(err);
          } else if (res.rows[0]) {
            resolve(200, res.rows[0]);
          } else {
            resolve(new Error('Flavor entry not added!'));
          }
        },
      );
    } else {
      reject(new Error('Unkown production day!'));
    }
  }),

  getFlavourEntries: (date, productionType) => new Promise((resolve, reject) => {
    if (productionType === 'Cutting Day') {
      db.query('SELECT * FROM cuttingflavourentries WHERE date=$1;', [date], (err, res) => {
        if (err) {
          reject(err);
        } else if (res.rows) {
          resolve(200, res.rows);
        } else {
          resolve(200, undefined);
        }
      });
    } else if (productionType === 'Packing Day') {
      db.query('SELECT * FROM packingflavourentries WHERE date=$1;', [date], (err, res) => {
        if (err) {
          reject(err);
        } else if (res.rows[0]) {
          resolve(200, res.rows);
        } else {
          resolve(200, undefined);
        }
      });
    } else if (productionType === 'Base Day') {
      db.query('SELECT * FROM baseflavourentries WHERE date=$1;', [date], (err, res) => {
        if (err) {
          reject(err);
        } else if (res.rows[0]) {
          resolve(200, res.rows);
        } else {
          resolve(200, undefined);
        }
      });
    } else if (productionType === 'Ice Cream Day') {
      db.query('SELECT * FROM icecreamflavorentires WHERE date=$1;', [date], (err, res) => {
        if (err) {
          reject(err);
        } else if (res.rows[0]) {
          resolve(200, res.rows);
        } else {
          resolve(200, undefined);
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
          } else if (res.rows[0]) {
            resolve(200);
          } else {
            resolve(new Error('Flavor entry not deleted!'));
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
          } else if (res.rows[0]) {
            resolve(200);
          } else {
            resolve(new Error('Flavor entry not deleted!'));
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
          } else if (res.rows[0]) {
            resolve(200);
          } else {
            resolve(new Error('Flavor entry not deleted!'));
          }
        },
      );
    } else if (productionType === 'Ice Cream Day') {
      db.query(
        'DELETE FROM icecreamflavorentires WHERE id=$1;',
        [id],
        (err, res) => {
          if (err) {
            reject(err);
          } else if (res.rows[0]) {
            resolve(200);
          } else {
            resolve(new Error('Flavor entry not deleted!'));
          }
        },
      );
    }
  }),
};

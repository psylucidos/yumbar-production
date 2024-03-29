/* eslint max-len: "off" */
const db = require('../database');

module.exports = {
  addFlavorEntry: (date, productionType, flavourEntryData) => new Promise((resolve, reject) => {
    if (productionType === 'Cutting Day') {
      db.query(
        'INSERT INTO cuttingflavourentries(productiondate, flavour, slabbatch, basebatch, secondbasebatch, slabamount, notes) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *;',
        [
          date,
          flavourEntryData.flavour,
          flavourEntryData.slabbatch,
          flavourEntryData.basebatch,
          flavourEntryData.secondbasebatch,
          flavourEntryData.slabamount,
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
        'INSERT INTO packingflavourentries(productiondate, flavour, batchnumber, slabamount, boxamount, smallboxamount, usebydate, sampleamount, leftoverbaramount, notes) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *;',
        [
          date,
          flavourEntryData.flavour,
          flavourEntryData.batchnumber,
          flavourEntryData.slabamount,
          flavourEntryData.boxamount,
          flavourEntryData.smallboxamount,
          flavourEntryData.usebydate === '' ? null : flavourEntryData.usebydate,
          flavourEntryData.sampleamount,
          flavourEntryData.leftoverbaramount,
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
        'INSERT INTO icecreamflavourentries(productiondate, flavour, batchnumber, jugsamount, traysamount, unsaleableweight, notes) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *;',
        [
          date,
          flavourEntryData.flavour,
          flavourEntryData.batchnumber,
          flavourEntryData.jugsamount,
          flavourEntryData.traysamount,
          flavourEntryData.unsaleableweight,
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
    } else if (productionType === 'Cake Ice Cream Day') {
      const flavours = `{"${flavourEntryData.flavour.join('", "')}"}`;
      const jugs = `{${flavourEntryData.jugsamount.join(', ')}}`;
      db.query(
        'INSERT INTO icecreamcakeflavourentries(productiondate, flavour, batchnumber, jugsamount, smallcakesamount, mediumcakesamount, largecakesamount, unsaleableweight, notes) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *;',
        [
          date,
          flavours,
          flavourEntryData.batchnumber,
          jugs,
          flavourEntryData.smallcakesamount,
          flavourEntryData.mediumcakesamount,
          flavourEntryData.largecakesamount,
          flavourEntryData.unsaleableweight,
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
        'UPDATE cuttingflavourentries SET flavour=$2, slabbatch=$3, basebatch=$4, secondbasebatch=$5, slabamount=$6, notes=$7 WHERE id=$1;',
        [
          id,
          flavourEntryData.flavour,
          flavourEntryData.slabbatch,
          flavourEntryData.basebatch,
          flavourEntryData.secondbasebatch,
          flavourEntryData.slabamount,
          flavourEntryData.notes,
        ],
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
    } else if (productionType === 'Packing Day') {
      db.query(
        'UPDATE packingflavourentries SET flavour=$2, batchnumber=$3, slabamount=$4, boxamount=$5, smallboxamount=$6, usebydate=$7, leftoverbaramount=$8, sampleamount=$9, notes=$10 WHERE id=$1;',
        [
          id,
          flavourEntryData.flavour,
          flavourEntryData.batchnumber,
          flavourEntryData.slabamount,
          flavourEntryData.boxamount,
          flavourEntryData.smallboxamount,
          flavourEntryData.usebydate,
          flavourEntryData.sampleamount,
          flavourEntryData.leftoverbaramount,
          flavourEntryData.notes,
        ],
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
          } else if (res.rowCount === 1) {
            resolve(200);
          } else {
            resolve(404);
          }
        },
      );
    } else if (productionType === 'Ice Cream Day') {
      db.query(
        'UPDATE icecreamflavourentries SET flavour=$2, batchnumber=$3, jugsamount=$4, traysamount=$5, unsaleableweight=$6, notes=$7 WHERE id=$1',
        [
          id,
          flavourEntryData.flavour,
          flavourEntryData.batchnumber,
          flavourEntryData.jugsamount,
          flavourEntryData.traysamount,
          flavourEntryData.unsaleableweight,
          flavourEntryData.notes,
        ],
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
    } else if (productionType === 'Cake Ice Cream Day') {
      const flavours = `{"${flavourEntryData.flavour.join('", "')}"}`;
      const jugs = `{${flavourEntryData.jugsamount.join(', ')}}`;
      db.query(
        'UPDATE icecreamcakeflavourentries SET flavour=$2, batchnumber=$3, jugsamount=$4, smallcakesamount=$5, mediumcakesamount=$6, largecakesamount=$7, unsaleableweight=$8, notes=$9 WHERE id=$1',
        [
          id,
          flavours,
          flavourEntryData.batchnumber,
          jugs,
          flavourEntryData.smallcakesamount,
          flavourEntryData.mediumcakesamount,
          flavourEntryData.largecakesamount,
          flavourEntryData.unsaleableweight,
          flavourEntryData.notes,
        ],
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
    } else if (productionType === 'Cake Ice Cream Day') {
      db.query('SELECT * FROM icecreamcakeflavourentries WHERE productiondate=$1;', [date], (err, res) => {
        if (err) {
          reject(err);
        } else if (res.rows) {
          resolve(res.rows);
        } else {
          reject(new Error('Unable to find flavour entries!'));
        }
      });
    } else {
      reject(new Error('Unkown production day!'));
    }
  }),

  getFlavourEntriesInRange: (startDate, endDate, productionType) => new Promise((resolve, reject) => {
    if (productionType === 'Cutting Day') {
      db.query('SELECT productiondate, AVG(slabbatch) slabbatch, AVG(basebatch) basebatch, SUM(slabamount) slabamount FROM cuttingflavourentries WHERE productiondate BETWEEN $1 AND $2 GROUP BY productiondate ORDER BY productiondate;', [startDate, endDate], (err, res) => {
        if (err) {
          reject(err);
        } else if (res.rows) {
          resolve(res.rows);
        } else {
          reject(new Error('Unable to find flavour entries!'));
        }
      });
    } else if (productionType === 'Packing Day') {
      db.query('SELECT productiondate, AVG(batchnumber) batchnumber, SUM(slabamount) slabamount, SUM(boxamount) boxamount, SUM(leftoverbaramount) leftoverbaramount FROM packingflavourentries WHERE productiondate BETWEEN $1 AND $2 GROUP BY productiondate ORDER BY productiondate;', [startDate, endDate], (err, res) => {
        if (err) {
          reject(err);
        } else if (res.rows) {
          resolve(res.rows);
        } else {
          reject(new Error('Unable to find flavour entries!'));
        }
      });
    } else if (productionType === 'Base Day') {
      db.query('SELECT productiondate, AVG(batchnumber) batchnumber, SUM(blenderamount) blenderamount, SUM(smallamount) smallamount, SUM(largeamount) largeamount, SUM(smallcakeamount) smallcakeamount, SUM(mediumcakeamount) mediumcakeamount, SUM(largecakeamount) largecakeamount FROM baseflavourentries WHERE productiondate BETWEEN $1 AND $2 GROUP BY productiondate ORDER BY productiondate;', [startDate, endDate], (err, res) => {
        if (err) {
          reject(err);
        } else if (res.rows) {
          resolve(res.rows);
        } else {
          reject(new Error('Unable to find flavour entries!'));
        }
      });
    } else if (productionType === 'Ice Cream Day') {
      db.query('SELECT productiondate, AVG(batchnumber) batchnumber, SUM(jugsamount) jugsamount, SUM(traysamount) traysamount, SUM(unsaleableweight) unsaleableweight FROM icecreamflavourentries WHERE productiondate BETWEEN $1 AND $2 GROUP BY productiondate ORDER BY productiondate;', [startDate, endDate], (err, res) => {
        if (err) {
          reject(err);
        } else if (res.rows) {
          resolve(res.rows);
        } else {
          reject(new Error('Unable to find flavour entries!'));
        }
      });
    } else if (productionType === 'Cake Ice Cream Day') {
      db.query('SELECT productiondate, AVG(batchnumber) batchnumber, SUM(jugsamount) jugsamount, SUM(cakesamount) cakesamount, SUM(unsaleableweight) unsaleableweight FROM icecreamcakeflavourentries WHERE productiondate BETWEEN $1 AND $2 GROUP BY productiondate ORDER BY productiondate;', [startDate, endDate], (err, res) => {
        if (err) {
          reject(err);
        } else if (res.rows) {
          resolve(res.rows);
        } else {
          reject(new Error('Unable to find flavour entries!'));
        }
      });
    } else {
      reject(new Error('Unkown production day!'));
    }
  }),

  getFlavoursAndBoxesFromPackingDays: () => new Promise((resolve, reject) => {
    db.query('SELECT flavour, SUM(boxamount) FROM packingflavourentries GROUP BY flavour;', [], (err, res) => {
      if (err) {
        reject(err);
      } else if (res.rows) {
        resolve(res.rows);
      } else {
        reject(new Error('Unable to find flavour entries!'));
      }
    });
  }),

  getFlavoursAndSlabsFromCuttingDays: () => new Promise((resolve, reject) => {
    db.query('SELECT flavour, SUM(slabamount) FROM cuttingflavourentries GROUP BY flavour;', [], (err, res) => {
      if (err) {
        reject(err);
      } else if (res.rows) {
        resolve(res.rows);
      } else {
        reject(new Error('Unable to find flavour entries!'));
      }
    });
  }),

  getFlavoursAndTraysFromIcecreamDays: () => new Promise((resolve, reject) => {
    db.query('SELECT flavour, SUM(traysamount) FROM icecreamflavourentries GROUP BY flavour;', [], (err, res) => {
      if (err) {
        reject(err);
      } else if (res.rows) {
        resolve(res.rows);
      } else {
        reject(new Error('Unable to find flavour entries!'));
      }
    });
  }),

  getFlavoursAndBasesFromBaseDays: () => new Promise((resolve, reject) => {
    db.query('SELECT flavour, SUM(blenderamount) FROM baseflavourentries GROUP BY flavour;', [], (err, res) => {
      if (err) {
        reject(err);
      } else if (res.rows) {
        resolve(res.rows);
      } else {
        reject(new Error('Unable to find flavour entries!'));
      }
    });
  }),

  getBoxesInRange: (startDate, endDate) => new Promise((resolve, reject) => {
    db.query('SELECT boxamount FROM packingflavourentries WHERE productiondate BETWEEN $1 AND $2;', [startDate, endDate], (err, res) => {
      if (err) {
        reject(err);
      } else if (res.rows) {
        resolve(res.rows);
      } else {
        reject(new Error('Unable to find flavour entries!'));
      }
    });
  }),

  getTraysInRange: (startDate, endDate) => new Promise((resolve, reject) => {
    db.query('SELECT traysamount FROM icecreamflavourentries WHERE productiondate BETWEEN $1 AND $2;', [startDate, endDate], (err, res) => {
      if (err) {
        reject(err);
      } else if (res.rows) {
        resolve(res.rows);
      } else {
        reject(new Error('Unable to find flavour entries!'));
      }
    });
  }),

  getCakesInRange: (startDate, endDate) => new Promise((resolve, reject) => {
    db.query('SELECT smallcakesamount, mediumcakeamount, largecakesamount FROM icecreamcakeflavourentries WHERE productiondate BETWEEN $1 AND $2;', [startDate, endDate], (err, res) => {
      if (err) {
        reject(err);
      } else if (res.rows) {
        resolve(res.rows);
      } else {
        reject(new Error('Unable to find flavour entries!'));
      }
    });
  }),

  getBasesInRange: (startDate, endDate) => new Promise((resolve, reject) => {
    db.query('SELECT blenderamount FROM baseflavourentries WHERE productiondate BETWEEN $1 AND $2;', [startDate, endDate], (err, res) => {
      if (err) {
        reject(err);
      } else if (res.rows) {
        resolve(res.rows);
      } else {
        reject(new Error('Unable to find flavour entries!'));
      }
    });
  }),

  getSlabsInRange: (startDate, endDate) => new Promise((resolve, reject) => {
    db.query('SELECT slabamount FROM cuttingflavourentries WHERE productiondate BETWEEN $1 AND $2;', [startDate, endDate], (err, res) => {
      if (err) {
        reject(err);
      } else if (res.rows) {
        resolve(res.rows);
      } else {
        reject(new Error('Unable to find flavour entries!'));
      }
    });
  }),

  deleteFlavorEntry: (id, productionType) => new Promise((resolve, reject) => {
    if (productionType === 'Cutting Day') {
      db.query(
        'DELETE FROM cuttingflavourentries WHERE id=$1;',
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
    } else if (productionType === 'Packing Day') {
      db.query(
        'DELETE FROM packingflavourentries WHERE id=$1;',
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
    } else if (productionType === 'Base Day') {
      db.query(
        'DELETE FROM baseflavourentries WHERE id=$1;',
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
    } else if (productionType === 'Ice Cream Day') {
      db.query(
        'DELETE FROM icecreamflavourentries WHERE id=$1;',
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
    } else if (productionType === 'Cake Ice Cream Day') {
      db.query(
        'DELETE FROM icecreamcakeflavourentries WHERE id=$1;',
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
    } else {
      reject(new Error('Unkown production day!'));
    }
  }),
};

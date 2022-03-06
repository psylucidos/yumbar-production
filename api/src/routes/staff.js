const Router = require('@koa/router');
const staffEntriesController = require('../controllers/staffEntries');

const router = new Router();
router.prefix('/staff');

router.post('/add', (ctx) => {
  const { date, staffEntryData } = ctx.body;

  staffEntriesController
    .addStaffEntry(date, staffEntryData)
    .then((res, newEntry) => {
      if (res === 200) {
        ctx.status = 201;
        ctx.body = newEntry;
      } else {
        ctx.status = 500;
      }
    })
    .catch((err) => {
      ctx.status = 500;
      console.error(err);
    });
});

router.post('/update', (ctx) => {
  const { id, staffEntryData } = ctx.body;

  staffEntriesController
    .updateStaffEntry(id, staffEntryData)
    .then((res, newEntry) => {
      if (res === 200) {
        ctx.status = 201;
        ctx.body = newEntry;
      } else {
        ctx.status = 500;
      }
    })
    .catch((err) => {
      ctx.status = 500;
      console.error(err);
    });
});

router.post('/delete', (ctx) => {
  const { id } = ctx.body;

  staffEntriesController
    .deleteStaffEntry(id)
    .then((res) => {
      if (res === 200) {
        ctx.status = 200;
      } else {
        ctx.status = 500;
      }
    })
    .catch((err) => {
      ctx.status = 500;
      console.error(err);
    });
});

router.post('/get', (ctx) => {
  const { date } = ctx.body;

  staffEntriesController
    .getStaffEntries(date)
    .then((res, entries) => {
      if (res === 200) {
        ctx.status = 200;
        ctx.body = entries;
      } else {
        ctx.status = 500;
      }
    })
    .catch((err) => {
      ctx.status = 500;
      console.error(err);
    });
});

module.exports = router;

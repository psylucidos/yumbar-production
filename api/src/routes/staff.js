const Router = require('@koa/router');
const staffEntriesController = require('../controllers/staffEntries');

const router = new Router();
router.prefix('/staff');

// TODO: Make controller promise return system much better

router.post('/add', async (ctx) => {
  const { date, staffEntryData } = ctx.request.body;

  const result = await staffEntriesController
    .addStaffEntry(date, staffEntryData);

  if (result.id) {
    ctx.status = 200;
    ctx.body = result;
  } else {
    ctx.status = 500;
    console.error(result);
  }
});

router.post('/update', async (ctx) => {
  const { id, staffEntryData } = ctx.request.body;

  const result = staffEntriesController
    .updateStaffEntry(id, staffEntryData);

  if (typeof result === 'number') {
    if (result === 404) {
      ctx.status = 404;
    }
  } else if (result.id) {
    ctx.status = 200;
    ctx.body = result;
  } else {
    ctx.status = 500;
    console.error(result);
  }
});

router.post('/delete', async (ctx) => {
  const { id } = ctx.request.body;

  const result = await staffEntriesController
    .deleteStaffEntry(id);

  if (typeof result === 'number') {
    if (result === 404) {
      ctx.status = 404;
    } else if (result === 200) {
      ctx.status = 200;
    }
  } else {
    ctx.status = 500;
    console.error(result);
  }
});

router.post('/get', async (ctx) => {
  const { date } = ctx.request.body;

  const result = await staffEntriesController
    .getStaffEntries(date);

  if (Array.isArray(result)) {
    ctx.status = 200;
    ctx.body = result;
  } else {
    ctx.status = 500;
    console.error(result);
  }
});

module.exports = router;

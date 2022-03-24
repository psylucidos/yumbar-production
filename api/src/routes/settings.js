const Router = require('@koa/router');
const settingsController = require('../controllers/settings');

const router = new Router();
router.prefix('/settings');

router.post('/add/staff', async (ctx) => {
  const { name } = ctx.request.body;

  const result = await settingsController
    .addStaffName(name);

  if (result.id) {
    ctx.status = 200;
    ctx.body = result;
  } else {
    ctx.status = 500;
    console.error(result);
  }
});

router.post('/delete/staff', async (ctx) => {
  const { id } = ctx.request.body;

  const result = await settingsController
    .deleteStaffName(id);

  if (result === 200) {
    ctx.status = 200;
  } else {
    ctx.status = 500;
    console.error(result);
  }
});

router.get('/get/staff', async (ctx) => {
  const result = await settingsController
    .getStaffNames();

  if (Array.isArray(result)) {
    ctx.status = 200;
    ctx.body = result;
  } else if (result === 404) {
    ctx.status = 200;
    ctx.body = {};
  } else {
    ctx.status = 500;
    console.error(result);
  }
});

router.post('/add/flavour', async (ctx) => {
  const { name } = ctx.request.body;

  const result = await settingsController
    .addFlavourName(name);

  if (result.id) {
    ctx.status = 200;
    ctx.body = result;
  } else {
    ctx.status = 500;
    console.error(result);
  }
});

router.post('/delete/flavour', async (ctx) => {
  const { id } = ctx.request.body;

  const result = await settingsController
    .deleteFlavourName(id);

  if (result === 200) {
    ctx.status = 200;
  } else {
    ctx.status = 500;
    console.error(result);
  }
});

router.get('/get/flavours', async (ctx) => {
  const result = await settingsController
    .getFlavourNames();

  if (Array.isArray(result)) {
    ctx.status = 200;
    ctx.body = result;
  } else if (result === 404) {
    ctx.status = 200;
    ctx.body = {};
  } else {
    ctx.status = 500;
    console.error(result);
  }
});

module.exports = router;

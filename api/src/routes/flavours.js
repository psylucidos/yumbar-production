const Router = require('@koa/router');
const flavourEntriesController = require('../controllers/flavourEntries');

const router = new Router();
router.prefix('/flavours');

router.post('/add', async (ctx) => {
  const { date, productionType, flavourEntryData } = ctx.request.body;

  // TODO: check all flavour data entry properties exist
  // TODO: maybe use koa bouncer

  const result = await flavourEntriesController
    .addFlavorEntry(date, productionType, flavourEntryData);

  if (result.id) {
    ctx.status = 200;
    ctx.body = result;
  } else {
    ctx.status = 500;
    console.error(result);
  }
});

router.post('/update', async (ctx) => {
  const { id, productionType, flavourEntryData } = ctx.request.body;

  const result = await flavourEntriesController
    .updateFlavorEntry(id, productionType, flavourEntryData);

  if (typeof result === 'number') {
    if (result === 404) {
      ctx.status = 404;
    } else if (result === 200) {
      ctx.status = 200;
      ctx.body = result;
    }
  } else {
    ctx.status = 500;
    console.error(result);
  }
});

router.post('/delete', async (ctx) => {
  const { id, productionType } = ctx.request.body;

  const result = await flavourEntriesController
    .deleteFlavorEntry(id, productionType);

  if (typeof result === 'number') {
    if (result === 200) {
      ctx.status = 200;
    } else if (result === 404) {
      ctx.status = 404;
    }
  } else {
    ctx.status = 500;
    console.error(result);
  }
});

router.post('/get', async (ctx) => {
  const { date, productionType } = ctx.request.body;

  const result = await flavourEntriesController
    .getFlavourEntries(date, productionType);

  if (Array.isArray(result)) {
    ctx.status = 200;
    ctx.body = result;
  } else {
    ctx.status = 500;
    console.error(result);
  }
});

module.exports = router;

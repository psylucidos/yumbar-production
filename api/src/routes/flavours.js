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

router.post('/getall', async (ctx) => {
  const result = await flavourEntriesController
    .getAllFlavourEntries();

  if (Array.isArray(result.cuttingData)) {
    ctx.status = 200;
    ctx.body = result;
  } else {
    ctx.status = 500;
    console.error(result);
  }
});

router.post('/getallflavours', async (ctx) => {
  const result = await flavourEntriesController
    .getAllFlavoursFromFlavourEntries();

  if (Array.isArray(result.cuttingData)) {
    ctx.status = 200;
    ctx.body = result;
  } else {
    ctx.status = 500;
    console.error(result);
  }
});

router.post('/getboxesinrange', async (ctx) => {
  const { body } = ctx.request;
  console.log('get boxes body', body);

  if (Array.isArray(body)) {
    for (let i = 0; i < body.length; i += 1) {
      console.log('for dates', body[i].start, body[i].end);
      const result = await flavourEntriesController // eslint-disable-line
        .getBoxesInRange(body[i].start, body[i].end);

      if (Array.isArray(result)) {
        let total = 0;
        for (let n = 0; n < result.length; n += 1) {
          total += result[n].boxamount;
        }
        body[i].boxes = total;
      } else {
        ctx.status = 500;
        throw new Error('Unkown box getting error!');
      }
    }
  }

  ctx.status = 200;
  ctx.body = body;
});

module.exports = router;

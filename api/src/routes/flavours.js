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

router.post('/getinrange', async (ctx) => {
  const { startDate, endDate, productionType } = ctx.request.body;

  const result = await flavourEntriesController
    .getFlavourEntriesInRange(startDate, endDate, productionType);

  if (Array.isArray(result)) {
    ctx.status = 200;
    ctx.body = result;
  } else {
    ctx.status = 500;
    console.error(result);
  }
});

router.post('/getpackingboxes', async (ctx) => {
  const result = await flavourEntriesController
    .getFlavoursAndBoxesFromPackingDays();

  if (Array.isArray(result)) {
    ctx.status = 200;
    ctx.body = result;
  } else {
    ctx.status = 500;
    console.error(result);
  }
});

router.post('/getcuttingslabs', async (ctx) => {
  const result = await flavourEntriesController
    .getFlavoursAndSlabsFromCuttingDays();

  if (Array.isArray(result)) {
    ctx.status = 200;
    ctx.body = result;
  } else {
    ctx.status = 500;
    console.error(result);
  }
});

router.post('/geticecreamtrays', async (ctx) => {
  const result = await flavourEntriesController
    .getFlavoursAndTraysFromIcecreamDays();

  if (Array.isArray(result)) {
    ctx.status = 200;
    ctx.body = result;
  } else {
    ctx.status = 500;
    console.error(result);
  }
});

router.post('/getbaseblenders', async (ctx) => {
  const result = await flavourEntriesController
    .getFlavoursAndBasesFromBaseDays();

  if (Array.isArray(result)) {
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

router.post('/gettraysinrange', async (ctx) => {
  const { body } = ctx.request;
  console.log('get trays body', body);

  if (Array.isArray(body)) {
    for (let i = 0; i < body.length; i += 1) {
      console.log('for dates', body[i].start, body[i].end);
      const result = await flavourEntriesController // eslint-disable-line
        .getTraysInRange(body[i].start, body[i].end);

      if (Array.isArray(result)) {
        let total = 0;
        for (let n = 0; n < result.length; n += 1) {
          total += result[n].traysamount;
        }
        body[i].trays = total;
      } else {
        ctx.status = 500;
        throw new Error('Unkown tray getting error!');
      }
    }
  }

  ctx.status = 200;
  ctx.body = body;
});

router.post('/getcakesinrange', async (ctx) => {
  const { body } = ctx.request;
  console.log('get cakes body', body);

  if (Array.isArray(body)) {
    for (let i = 0; i < body.length; i += 1) {
      console.log('for dates', body[i].start, body[i].end);
      const result = await flavourEntriesController // eslint-disable-line
        .getCakesInRange(body[i].start, body[i].end);

      if (Array.isArray(result)) {
        let total = 0;
        for (let n = 0; n < result.length; n += 1) {
          total += result[n].cakesamount;
        }
        body[i].cakes = total;
      } else {
        ctx.status = 500;
        throw new Error('Unkown cake getting error!');
      }
    }
  }

  ctx.status = 200;
  ctx.body = body;
});

router.post('/getbasesinrange', async (ctx) => {
  const { body } = ctx.request;
  console.log('get bases body', body);

  if (Array.isArray(body)) {
    for (let i = 0; i < body.length; i += 1) {
      console.log('for dates', body[i].start, body[i].end);
      const result = await flavourEntriesController // eslint-disable-line
        .getBasesInRange(body[i].start, body[i].end);

      if (Array.isArray(result)) {
        let total = 0;
        for (let n = 0; n < result.length; n += 1) {
          total += result[n].blenderamount;
        }
        body[i].blenderbatches = total;
      } else {
        ctx.status = 500;
        throw new Error('Unkown base getting error!');
      }
    }
  }

  ctx.status = 200;
  ctx.body = body;
});

router.post('/getslabsinrange', async (ctx) => {
  const { body } = ctx.request;
  console.log('get slabs body', body);

  if (Array.isArray(body)) {
    for (let i = 0; i < body.length; i += 1) {
      console.log('for dates', body[i].start, body[i].end);
      const result = await flavourEntriesController // eslint-disable-line
        .getSlabsInRange(body[i].start, body[i].end);

      if (Array.isArray(result)) {
        let total = 0;
        for (let n = 0; n < result.length; n += 1) {
          total += result[n].slabamount;
        }
        body[i].slabs = total;
      } else {
        ctx.status = 500;
        throw new Error('Unkown base getting error!');
      }
    }
  }

  ctx.status = 200;
  ctx.body = body;
});

module.exports = router;

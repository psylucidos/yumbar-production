const Router = require('@koa/router');
const daysController = require('../controllers/days');

const router = new Router();
router.prefix('/days');

router.post('/add', async (ctx) => {
  const { date, productionType } = ctx.request.body;

  const result = await daysController
    .addDay(date, productionType);

  if (result.id) {
    ctx.status = 200;
    ctx.body = result;
  } else {
    ctx.status = 500;
    console.error(result);
  }
});

router.post('/update', async (ctx) => {
  const { id, productionType } = ctx.request.body;

  const result = await daysController
    .updateDay(id, productionType);

  if (result === 200) {
    ctx.status = 200;
  } else {
    ctx.status = 500;
    console.error(result);
  }
});

router.post('/get', async (ctx) => {
  const { date } = ctx.request.body;

  const result = await daysController
    .getDay(date);

  if (result) {
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

router.post('/delete', async (ctx) => {
  const { date, productionType } = ctx.request.body;

  const result = await daysController
    .deleteDay(date, productionType);

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

module.exports = router;

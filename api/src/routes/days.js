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

router.post('/get', async (ctx) => {
  const { date } = ctx.request.body;

  const result = await daysController
    .getDay(date);

  if (result.id) {
    ctx.status = 200;
    ctx.body = result;
  } else {
    ctx.status = 500;
    console.error(result);
  }
});

module.exports = router;

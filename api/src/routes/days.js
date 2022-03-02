const Router = require('@koa/router');
const daysController = require('../controllers/days');

const router = new Router();
router.prefix('/days');

router.post('/add', (ctx) => {
  const { date, productionType } = ctx.body;

  daysController
    .addDay(date, productionType)
    .then((res, newDay) => {
      if (res === 200) {
        ctx.status = 201;
        ctx.body = newDay;
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

  daysController
    .getDay(date)
    .then((res, day) => {
      if (res === 200) {
        ctx.status = 200;
        ctx.body = day;
      } else {
        ctx.status = 500;
      }
    })
    .catch((err) => {
      ctx.status = 500;
      console.error(err);
    });
});

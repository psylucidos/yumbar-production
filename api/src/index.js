const Router = require('@koa/router');

const router = new Router();

router.prefix('/api');

const authRouter = require('./routes/auth');
const daysRouter = require('./routes/days');
const flavoursRouter = require('./routes/flavours');
const staffRouter = require('./routes/staff');

router
  .use(authRouter.routes())
  .use(authRouter.allowedMethods())
  .use(daysRouter.routes())
  .use(daysRouter.allowedMethods())
  .use(flavoursRouter.routes())
  .use(flavoursRouter.allowedMethods())
  .use(staffRouter.routes())
  .use(staffRouter.allowedMethods());

module.exports = router;

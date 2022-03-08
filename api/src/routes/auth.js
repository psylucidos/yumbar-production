const Router = require('@koa/router');
const authController = require('../controllers/auth');

const router = new Router();
router.prefix('/auth');

router.post('/login', async (ctx) => {
  const { username, password } = ctx.request.body;

  const result = await authController
    .login(username, password);

  if (typeof result === 'number') {
    ctx.status = result;
  } else {
    ctx.status = 500;
    console.error(result);
  }
});

router.post('/register', async (ctx) => {
  const { username, password } = ctx.request.body;

  const result = await authController
    .register(username, password);

  if (typeof result === 'number') {
    ctx.status = result;
  } else {
    ctx.status = 500;
    console.error(result);
  }
});

module.exports = router;

const Router = require('@koa/router');
const jwt = require('jsonwebtoken');
const authController = require('../controllers/auth');

const router = new Router();
router.prefix('/auth');

router.post('/login', async (ctx) => {
  const { username, password } = ctx.request.body;

  const result = await authController
    .login(username, password);

  console.log('auth controller res', result);

  if (result.status === 200) {
    ctx.status = 200;
    ctx.body = {
      token: jwt.sign({
        username: result.body.username,
        password: result.body.password,
      }, process.env.SECRET, {
        expiresIn: '7h',
      }),
    };
  } else if (result.status === 401 || result.status === 404) {
    ctx.status = 401;
  } else {
    console.error(result);
  }
});

router.post('/register', async (ctx) => {
  const { username, password } = ctx.request.body;

  const result = await authController
    .register(username, password);

  console.log('auth controller res', result);

  if (result.status === 200) {
    ctx.status = 200;
    ctx.body = {
      token: jwt.sign({
        username: result.body.username,
        password: result.body.password,
      }, process.env.SECRET, {
        expiresIn: '7h',
      }),
    };
  } else if (result.status === 401) {
    ctx.status = 401;
  } else {
    ctx.status = 500;
    console.error(result);
  }
});

module.exports = router;

const Router = require('@koa/router');
const authController = require('../controllers/auth');

const router = new Router();
router.prefix('/auth');

router.post('/login', (ctx) => {
  const { username, password } = ctx.body;

  authController
    .login(username, password)
    .then((res) => {
      if (res === 200) {
        ctx.status = 200;
      } else {
        ctx.status = 500;
      }
    })
    .catch((err) => {
      const errMsg = String(err).slice(7); // TODO: make less sketchy
      if (errMsg === 'Incorrect login details!') {
        ctx.status = 401;
      } else {
        ctx.status = 500;
        console.error(err);
      }
    });
});

router.post('/register', (ctx) => {
  const { username, password } = ctx.body;

  authController
    .register(username, password)
    .then((res) => {
      if (res === 200) {
        ctx.status = 200;
      } else {
        ctx.status = 500;
      }
    })
    .catch((err) => {
      const errMsg = String(err).slice(7); // TODO: make less sketchy
      if (errMsg === 'Username taken!') {
        ctx.status = 401;
      } else {
        ctx.status = 500;
        console.error(err);
      }
    });
});

module.exports = router;

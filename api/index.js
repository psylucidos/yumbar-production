require('dotenv').config();

const Koa = require('koa');
const Router = require('@koa/router');

const app = new Koa();
const router = new Router();

router.get('/', (ctx) => {
  ctx.body = 'pong!';
});

app
  .use(router.routes())
  .use(router.allowedMethods())
  .listen(process.env.PORT);

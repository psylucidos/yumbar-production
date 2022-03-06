require('dotenv').config();

const Koa = require('koa');
const Router = require('@koa/router');
// TODO: install body parser
// TODO: install cors
// TODO: install todo plugin!
// TODO: install koa-bouncer
// TODO: setup JWT and require auth for API routes
// TODO: setup route logging and error handling

const app = new Koa();
const router = new Router();

const apiRouter = require('./src');

router.get('/ping', (ctx) => {
  ctx.body = 'pong!';
});

app
  .use(apiRouter.routes())
  .use(apiRouter.allowedMethods())
  .use(router.routes())
  .use(router.allowedMethods())
  .listen(process.env.PORT);

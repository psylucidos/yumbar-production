require('dotenv').config();

const Koa = require('koa');
const Router = require('@koa/router');
const bodyParser = require('koa-bodyparser');
const cors = require('@koa/cors');
const jwt = require('koa-jwt');

const app = new Koa();
const router = new Router();

const apiRouter = require('./src');

router.get('/ping', async (ctx) => {
  ctx.body = 'pong!';
});

app
  .use(cors({
    origin: '*',
  }))
  .use(bodyParser())
  .use(jwt({
    secret: process.env.SECRET,
  }).unless({ path: [/^\/api\/auth/] }))
  .use(async (ctx, next) => {
    console.log(` --- [${ctx.method}] ${ctx.path} ---`);
    if (process.env.VERBOSE) {
      console.log('[REQ]', ctx.request.body);
    }
    const start = new Date().getTime();
    try {
      await next();
    } catch (e) {
      console.error(e);
      if (e.status === 401) {
        ctx.status = 401;
        ctx.body = {
          error: e.originalError ? e.originalError.message : e.message,
        };
      } else {
        ctx.status = 500;
        ctx.body = e.message;
        console.error(e);
      }
      // TODO: connect to my status board
    } finally {
      const end = new Date().getTime();
      console.log(` --- [${ctx.method}] ${ctx.path} ${ctx.status} - ${end - start}ms ---`);
      if (process.env.VERBOSE) {
        console.log('[RES]', ctx.body);
      }
    }
  })
  .use(apiRouter.routes())
  .use(apiRouter.allowedMethods())
  .use(router.routes())
  .use(router.allowedMethods())
  .listen(process.env.PORT);

console.log(`Listening on port ${process.env.PORT}`); // eslint-disable-line

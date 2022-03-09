require('dotenv').config();

const Koa = require('koa');
const Router = require('@koa/router');
const bodyParser = require('koa-bodyparser');
const cors = require('@koa/cors');
// TODO: setup JWT and require auth for API routes
// TODO: setup route logging and error handling
// TODO: create error handling

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
  .use(async (ctx, next) => {
    console.log(` --- [${ctx.method}] ${ctx.path} ---`);
    if (process.env.VERBOSE) {
      console.log('[REQ]', ctx.request.body);
    }
    const start = new Date().getTime();
    await next();
    const end = new Date().getTime();
    console.log(` --- [${ctx.method}] ${ctx.path} ${ctx.status} - ${end - start}ms ---`);
    if (process.env.VERBOSE) {
      console.log('[RES]', ctx.body);
    }
  })
  .use(apiRouter.routes())
  .use(apiRouter.allowedMethods())
  .use(router.routes())
  .use(router.allowedMethods())
  .listen(process.env.PORT);

console.log(`Listening on port ${process.env.PORT}`); // eslint-disable-line

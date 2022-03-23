require('dotenv').config();

const Koa = require('koa');
const Router = require('@koa/router');
const bodyParser = require('koa-bodyparser');
const cors = require('@koa/cors');
const jwt = require('koa-jwt');
const hook = require('server-hook');

const app = new Koa();
const router = new Router();

const apiRouter = require('./src');

hook.init({ // initialise status hook
  target: process.env.STATUSAPIURL,
  projectName: 'yumbar-production',
  interval: 60,
});

app.on('error', (err) => {
  hook.logErr(err);
});

app
  .use(cors())
  .use(bodyParser())
  .use(async (ctx, next) => {
    console.log(` --- [${ctx.method}] ${ctx.path} ---`);
    if (process.env.VERBOSE) {
      console.log('[REQ]', ctx.request.body);
    }
    const start = new Date().getTime();
    try {
      await next();
    } catch (e) {
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
      hook.request(end - start);
    }
  })
  .use(jwt({
    secret: process.env.SECRET,
  }).unless({ path: [/^\/api\/auth*/] }))
  .use(apiRouter.routes())
  .use(apiRouter.allowedMethods())
  .use(router.routes())
  .use(router.allowedMethods())
  .listen(process.env.PORT);

console.log(`Listening on port ${process.env.PORT}`); // eslint-disable-line

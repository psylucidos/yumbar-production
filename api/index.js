require('dotenv').config();

const Koa = require('koa');
const Router = require('@koa/router');
const bodyParser = require('koa-bodyparser');
const cors = require('@koa/cors');
// TODO: setup JWT and require auth for API routes
// TODO: setup route logging and error handling

const app = new Koa();
const router = new Router();

const apiRouter = require('./src');

router.get('/ping', (ctx) => {
  ctx.body = 'pong!';
});

app
  .use(cors({
    origin: '*',
  }))
  .use(bodyParser())
  .use(apiRouter.routes())
  .use(apiRouter.allowedMethods())
  .use(router.routes())
  .use(router.allowedMethods())
  .listen(process.env.PORT);

console.log(`Listening on port ${process.env.PORT}`); // eslint-disable-line

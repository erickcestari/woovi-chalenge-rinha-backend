import Koa from 'koa';
import koaLogger from 'koa-logger';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';
import Router from '@koa/router';
import { donationGet } from './modules/donation/donationGet';

const app = new Koa();
const router = new Router();

app.use(bodyParser());
app.use(koaLogger());
app.use(cors({ maxAge: 86400, credentials: true }));

router.get('/', ctx => {
  const info = [
    'GET  / - OpenPix Backend integration',
    'POST /donation - Create a new Donation',
    'GET /donation/id - Get Donation data',
    'POST /webhook - Webhook to receive Charge payment status update from OpenPix service',
  ];

  ctx.status = 200;
  ctx.body = info.join('\n');
});

router.get('/donation/:id', donationGet);

app.use(router.routes()).use(router.allowedMethods());

export default app;
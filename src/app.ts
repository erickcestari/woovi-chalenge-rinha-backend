import cors from '@koa/cors';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import { graphqlHTTP } from 'koa-graphql';
import koaLogger from 'koa-logger';
import mount from 'koa-mount';
import { clientSchema } from './modules/client/clientGraphql';
import { transactionSchema } from './modules/transaction/transactionGraphql';

const app = new Koa();

app.use(bodyParser());
app.use(koaLogger());
app.use(cors({ maxAge: 86400, credentials: true }));

app.use(mount('/client', graphqlHTTP({
  schema: clientSchema,
  graphiql: true,
})));

app.use(mount('/transaction', graphqlHTTP({
  schema: transactionSchema,
  graphiql: true,
})));

export default app;
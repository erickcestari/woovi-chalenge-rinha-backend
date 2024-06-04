import cors from '@koa/cors';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import { graphqlHTTP } from 'koa-graphql';
import koaLogger from 'koa-logger';
import mount from 'koa-mount';
import { schema } from './schema/schema';

const app = new Koa();

app.use(bodyParser());
app.use(koaLogger());
app.use(cors({ maxAge: 86400, credentials: true }));

app.use(mount('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: true,
})));

export default app;
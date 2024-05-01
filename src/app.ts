import Koa from 'koa';
import koaLogger from 'koa-logger';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';
import mount from 'koa-mount';
import { graphqlHTTP } from 'koa-graphql';
import { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLNonNull } from 'graphql';
import { clientGet } from './modules/client/clientGet';

const app = new Koa();

app.use(bodyParser());
app.use(koaLogger());
app.use(cors({ maxAge: 86400, credentials: true }));

// Define the Donation type
const DonationType = new GraphQLObjectType({
  name: 'Donation',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLString) },
    // Add other fields as needed
  },
});

// Define the Query type
const QueryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    donation: {
      type: DonationType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: (root, args) => clientGet(args.id),
    },
  },
});

// Create the schema
const schema = new GraphQLSchema({
  query: QueryType,
});

// Use the graphqlHTTP middleware with the schema
app.use(mount('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: true, // Enable GraphiQL IDE
})));

export default app;
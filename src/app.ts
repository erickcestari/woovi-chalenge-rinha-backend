import cors from '@koa/cors';
import { GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLSchema, GraphQLString } from 'graphql';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import { graphqlHTTP } from 'koa-graphql';
import koaLogger from 'koa-logger';
import mount from 'koa-mount';
import { clientGet } from './modules/client/clientGet';
import { z } from 'zod';

const app = new Koa();

app.use(bodyParser());
app.use(koaLogger());
app.use(cors({ maxAge: 86400, credentials: true }));

// Define the Client type
const ClientType = new GraphQLObjectType({
  name: 'Client',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLInt) },
    limit: { type: GraphQLInt },
    balance: { type: GraphQLInt },
    available: { type: GraphQLInt },
    last_transactions: {
      type: new GraphQLList(new GraphQLObjectType({
        name: 'Transaction',
        fields: {
          id: { type: new GraphQLNonNull(GraphQLInt) },
          value: { type: GraphQLInt },
          type: { type: GraphQLString },
          description: { type: GraphQLString },
          performed_at: { type: GraphQLString },
        }
      }))
    },
  },
});

const ArgsSchema = z.object({
  id: z.number(),
});

// Define the Query type
const QueryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    client: {
      type: ClientType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve: async (root, args) => {
        console.log(args)

        // Validate the args
        const validatedArgs = ArgsSchema.parse(args);

        const client = await clientGet(validatedArgs.id);
        console.log(client)
        return client;
      },
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
import { GraphQLObjectType, GraphQLNonNull, GraphQLInt, GraphQLList, GraphQLString, GraphQLSchema } from "graphql";
import { z } from "zod";
import { clientGet } from "./clientGet";

export const ClientType = new GraphQLObjectType({
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

export const ClientQuery = new GraphQLObjectType({
  name: 'ClientQuery',
  fields: {
    client: {
      type: ClientType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve: async (root, args) => {
        const validatedArgs = ArgsSchema.parse(args);
        const client = await clientGet(validatedArgs.id);
        return client;
      },
    },
  },
});

export const clientSchema = new GraphQLSchema({
  query: ClientQuery,
});
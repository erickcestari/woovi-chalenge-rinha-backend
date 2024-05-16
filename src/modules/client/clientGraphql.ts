import { GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLSchema, GraphQLString } from "graphql";
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

export const ClientQuery = new GraphQLObjectType({
  name: 'ClientQuery',
  fields: {
    client: {
      type: ClientType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve: async (_, args) => {
        const client = await clientGet(args.id);
        return client;
      },
    },
  },
});

export const clientSchema = new GraphQLSchema({
  query: ClientQuery,
});
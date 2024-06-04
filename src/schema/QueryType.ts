import { GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { clientGet } from "../modules/client/clientGet";

const BalanceType = new GraphQLObjectType({
  name: 'ClientBalance',
  fields: {
    limit: { type: GraphQLInt },
    total: { type: GraphQLInt },
    statementDate: { type: GraphQLString },
  },
});

const TransactionType = new GraphQLObjectType({
  name: 'ClientTransaction',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLInt) },
    value: { type: GraphQLInt },
    type: { type: GraphQLString },
    description: { type: GraphQLString },
    performedAt: {
      type: GraphQLString,
      resolve: (transaction) => {
        return new Date(transaction.performedAt).toISOString();
      },
    },
  },
});

export const ClientType = new GraphQLObjectType({
  name: 'ClientDetails',
  fields: {
    balance: { type: BalanceType },
    recentTransactions: { type: new GraphQLList(TransactionType) },
  },
});

export const QueryType = new GraphQLObjectType({
  name: 'Query',
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
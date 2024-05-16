import { GraphQLInputObjectType, GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLScalarType, GraphQLSchema, GraphQLString, Kind } from "graphql";
import { transactionPost } from "./transactionPost";

const TransactionTypeScalar = new GraphQLScalarType({
  name: 'TransactionType',
  description: "Type must be either 'd' or 'c'",
  serialize(value) {
    return value;
  },
  parseValue(value) {
    if (value === 'd' || value === 'c') {
      return value;
    }
    throw new Error("TransactionType must be either 'd' or 'c'");
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      if (ast.value === 'd' || ast.value === 'c') {
        return ast.value;
      }
    }
    throw new Error("TransactionType must be either 'd' or 'c'");
  },
});

export const TransactionInputType = new GraphQLInputObjectType({
  name: 'TransactionInput',
  fields: {
    value: { type: new GraphQLNonNull(GraphQLInt) },
    type: { type: new GraphQLNonNull(TransactionTypeScalar) },
    description: { type: GraphQLString },
    clientId: { type: new GraphQLNonNull(GraphQLInt) },
  },
});

export const TransactionType = new GraphQLObjectType({
  name: 'Transaction',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLInt) },
    value: { type: new GraphQLNonNull(GraphQLInt) },
    type: { type: new GraphQLNonNull(TransactionTypeScalar) },
    description: { type: GraphQLString },
    performedAt: { type: new GraphQLNonNull(GraphQLString) },
    currentBalance: { type: new GraphQLNonNull(GraphQLInt) },
  },
});

export const TransactionMutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createTransaction: {
      type: TransactionType,
      args: {
        transaction: { type: new GraphQLNonNull(TransactionInputType) },
      },
      resolve: async (_, args) => {
        const transaction = await transactionPost(args.transaction);

        return transaction;
      },
    },
  },
});

export const transactionSchema = new GraphQLSchema({
  query: TransactionType,
  mutation: TransactionMutation,
});
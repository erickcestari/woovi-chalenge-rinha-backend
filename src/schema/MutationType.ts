import { GraphQLInputObjectType, GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLScalarType, GraphQLString, Kind } from "graphql";
import { transactionPost } from "../modules/transaction/transactionPost";

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

const TransactionInputType = new GraphQLInputObjectType({
  name: 'TransactionInput',
  fields: {
    value: { type: new GraphQLNonNull(GraphQLInt) },
    type: { type: new GraphQLNonNull(TransactionTypeScalar) },
    description: { type: GraphQLString },
    clientId: { type: new GraphQLNonNull(GraphQLInt) },
  },
});

const BalanceType = new GraphQLObjectType({
  name: 'ClientBalanceTransaction',
  fields: {
    balance: { type: GraphQLInt },
    limit: { type: GraphQLInt },
  },
});

export const  MutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createTransaction: {
      type: BalanceType,
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
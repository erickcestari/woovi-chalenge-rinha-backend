import { GraphQLInputObjectType, GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLSchema, GraphQLString } from "graphql";
import { z } from "zod";
import { transactionPost } from "./transactionPost";

export const TransactionInput = new GraphQLInputObjectType({
  name: 'TransactionInput',
  fields: {
    value: { type: new GraphQLNonNull(GraphQLInt) },
    type: { type: new GraphQLNonNull(GraphQLString) },
    description: { type: GraphQLString },
    clientId: { type: new GraphQLNonNull(GraphQLInt) },
  },
});

export const TransactionType = new GraphQLObjectType({
  name: 'Transaction',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLInt) },
    value: { type: new GraphQLNonNull(GraphQLInt) },
    type: { type: new GraphQLNonNull(GraphQLString) },
    description: { type: GraphQLString },
    performed_at: { type: new GraphQLNonNull(GraphQLString) },
    currentBalance: { type: new GraphQLNonNull(GraphQLInt) },
  },
});

const ArgsSchema = z.object({
  transaction: z.object({
    value: z.number(),
    type: z.string().refine(value => value === 'd' || value === 'c', {
      message: "Type must be either 'd' or 'c'",
    }),
    description: z.string().optional(),
    clientId: z.number(),
  }),
});

export const TransactionMutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createTransaction: {
      type: TransactionType,
      args: {
        transaction: { type: new GraphQLNonNull(TransactionInput) },
      },
      resolve: async (_, args) => {
        const validatedArgs = ArgsSchema.parse(args);
        const transaction = await transactionPost(validatedArgs.transaction);
        console.log(transaction);

        return transaction;
      },
    },
  },
});

export const transactionSchema = new GraphQLSchema({
  query: TransactionType,
  mutation: TransactionMutation,
});
import { GraphQLInputObjectType, GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLSchema, GraphQLString } from "graphql";
import { transactionPost } from "./transactionPost";
import { z } from "zod";
import { cli } from "webpack";

export const TransactionInput = new GraphQLInputObjectType({
  name: 'TransactionInput',
  fields: {
    value: { type: new GraphQLNonNull(GraphQLInt) },
    type: { type: new GraphQLNonNull(GraphQLString) },
    description: { type: GraphQLString },
    performed_at: { type: new GraphQLNonNull(GraphQLString) },
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
    clientId: { type: new GraphQLNonNull(GraphQLInt) },
  },
});

const ArgsSchema = z.object({
  transaction: z.object({
    id: z.number().optional(),
    value: z.number(),
    type: z.string(),
    description: z.string().optional(),
    performed_at: z.string().transform((value) => new Date(value)),
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
      resolve: async (root, args) => {
        const validatedArgs = ArgsSchema.parse(args);
        const transaction = await transactionPost(validatedArgs.transaction);

        return transaction;
      },
    },
  },
});

export const transactionSchema = new GraphQLSchema({
  query: TransactionType,
  mutation: TransactionMutation,
});
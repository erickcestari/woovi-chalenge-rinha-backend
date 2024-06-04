import { GraphQLSchema } from "graphql";
import { QueryType } from "./QueryType";
import { MutationType } from "./MutationType";

const schema = new GraphQLSchema({
  mutation: MutationType,
  query: QueryType,
});

export { schema }
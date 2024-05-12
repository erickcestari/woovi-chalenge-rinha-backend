import TransactionModel, { ITransaction } from "./transactionModel";

export const transactionPost = async (args: Partial<ITransaction>) => {
  const transactionId = await TransactionModel.count()
  const transaction = await TransactionModel.create({
    id: transactionId,
    clientId: args.clientId,
    value: args.value,
    type: args.type,
    description: args.description,
    performed_at: args.performed_at,
  })

  return {
    id: transaction.id,
    value: transaction.value,
    type: transaction.type,
    description: transaction.description,
    performed_at: transaction.performed_at,
  }
}
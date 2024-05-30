import ClientModel from "../client/clientModel";
import { ITransactionDTO } from "./transactionDTO";
import TransactionModel from "./transactionModel";

export const transactionPost = async (args: ITransactionDTO) => {
    const currentBalance = args.type === 'c' ? args.value : -args.value;

    const client = await ClientModel.findOneAndUpdate(
      { id: args.clientId },
      { $inc: { balance: currentBalance } }
    ).lean();

    if (!client || !client.id || !client.balance || !client.limit) {
      throw new Error(`No client found with id: ${args.clientId}`);
    }

    if (client.balance < -client.limit) {
      throw new Error('Transaction exceeds client limit');
    }

    const transactionId = await TransactionModel.countDocuments()

    await TransactionModel.create([{
      id: transactionId,
      clientId: args.clientId,
      value: args.value,
      type: args.type,
      description: args.description,
      performedAt: new Date(),
    }]);

    return {
      limit: client.limit,
      balance: client.balance,
    };
}
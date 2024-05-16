import { startSession } from "mongoose";
import ClientModel from "../client/clientModel";
import { ITransactionDTO } from "./transactionDTO";
import TransactionModel from "./transactionModel";

export const transactionPost = async (args: ITransactionDTO) => {
  const session = await startSession();
  session.startTransaction();

  try {
    const client = await ClientModel.findOne({ id: args.clientId }).session(session).lean();

    if (!client) {
      throw new Error(`No client found with id: ${args.clientId}`);
    }

    const currentBalance = client.balance || 0;
    const currentLimit = client.limit || 0;
    const newBalance = args.type === 'c' ? currentBalance + args.value : currentBalance - args.value;

    if (newBalance < -currentLimit) {
      throw new Error('Transaction exceeds client limit');
    }

    await ClientModel.findByIdAndUpdate(client._id, {
      $set: {
        balance: newBalance,
      },
    }).session(session);

    const transactionId = await TransactionModel.countDocuments().session(session);

    await TransactionModel.create([{
      id: transactionId,
      clientId: args.clientId,
      value: args.value,
      type: args.type,
      description: args.description,
      performedAt: new Date(),
    }], { session });

    await session.commitTransaction();

    return {
      limit: client.limit,
      balance: newBalance,
    };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
}
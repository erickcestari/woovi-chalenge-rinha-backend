import { startSession } from "mongoose";
import ClientModel from "../client/clientModel";
import { ITransactionDTO } from "./transactionDTO";
import TransactionModel from "./transactionModel";
import { Job, Queue, Worker } from "bullmq";

const connectionOptions = {
  connection: {
    host: "localhost",
    port: parseInt(process.env.REDIS_PORT ?? '6379'),
  },
};

const transactionQueue = new Queue<ITransactionDTO>("transactionQueue", connectionOptions,);

new Worker("transactionQueue", async (job: Job<ITransactionDTO>) => {
  const args = job.data;
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

    if (newBalance < currentLimit) {
      throw new Error('Transaction exceeds client limit');
    }

    await ClientModel.findByIdAndUpdate(client._id, {
      $set: {
        balance: newBalance,
      },
    }).session(session);

    const transactionId = await TransactionModel.countDocuments().session(session);

    const transaction = await TransactionModel.create([{
      id: transactionId,
      clientId: args.clientId,
      value: args.value,
      type: args.type,
      description: args.description,
      performed_at: new Date(),
    }], { session });

    await session.commitTransaction();

    return {
      id: transaction[0].id,
      value: transaction[0].value,
      type: transaction[0].type,
      description: transaction[0].description,
      performed_at: new Date(transaction[0].performed_at).toISOString(),
      currentBalance: newBalance,
    };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
}, connectionOptions);


export const transactionPost = (args: ITransactionDTO) => {
  transactionQueue.add("Transaction " + args.clientId, args);
}
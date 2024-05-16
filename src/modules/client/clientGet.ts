import TransactionModel from '../transaction/transactionModel';
import ClientModel from './clientModel';

export const clientGet = async (id: number) => {
  const client = await ClientModel.findOne({
    id: id,
  }).lean();

  if (!client) {
    throw new Error(`No client found with id: ${id}`);
  }

  const transactions = await TransactionModel.find({ clientId: id }).lean();

  return {
    balance: {
      total: client.balance,
      statementDate: new Date().toISOString(),
      limit: client.limit,
    },
    recentTransactions: transactions,
  };
}
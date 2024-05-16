import TransactionModel from '../transaction/transactionModel';
import ClientModel from './clientModel';

export const clientGet = async (id: number) => {
  const client = await ClientModel.findOne({
    id: id,
  }).populate('last_transactions').lean();

  if (!client) {
    throw new Error(`No client found with id: ${id}`);
  }

  const transactions = await TransactionModel.find({ clientId: id }).lean();

  return {
    id: client.id,
    limit: client.limit,
    balance: client.balance,
    last_transactions: transactions,
  };
}
import ClientModel from "../client/clientModel";
import TransactionModel, {ITransactionDTO} from "./transactionModel";

export const transactionPost = async (args: ITransactionDTO) => {
    const value = args.type === 'c' ? args.value : -args.value;

    const client = await ClientModel.findOneAndUpdate(
      { id: args.clientId, $expr: { $gte: [{ $sum: ['$balance', value] }, { $multiply: [-1, '$limit'] }] },},
      { $inc: { balance: value } },
      { new: true }
    ).lean();

    if (!client) {
      const clientExists = await ClientModel.findOne({ id: args.clientId }).lean();
      if (!clientExists){
        throw new Error('Client not found');
      }
      
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
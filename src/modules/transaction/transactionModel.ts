import mongoose from 'mongoose';

const Schema = new mongoose.Schema({
  id: Number,
  value: Number,
  type: String,
  description: String,
  performedAt: Date,
  clientId: { type: mongoose.Schema.Types.Number, ref: 'Client' },
});

export type ITransaction = {
  id: number;
  value: number;
  type: string;
  description?: string;
  performedAt: Date;
  clientId: number;
}

export type ITransactionDTO = Omit<ITransaction, "id" | "performedAt">

const TransactionModel = mongoose.model<ITransaction>('Transaction', Schema);

export default TransactionModel;

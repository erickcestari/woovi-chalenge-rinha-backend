import mongoose from 'mongoose';

const Schema = new mongoose.Schema({
  id: Number,
  value: Number,
  type: String,
  description: String,
  performedAt: Date,
  clientId: { type: mongoose.Schema.Types.Number, ref: 'Client' },
});

export type TransactionType = {
  id: number;
  value: number;
  type: string;
  description?: string;
  performedAt: Date;
  clientId: number;
}

export type TransactionDTO = Omit<TransactionType, "id" | "performedAt">

const TransactionModel = mongoose.model<TransactionType>('Transaction', Schema);

export default TransactionModel;

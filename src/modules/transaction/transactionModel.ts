import mongoose from 'mongoose';

const Schema = new mongoose.Schema({
  value: Number,
  type: String,
  description: String,
  performed_at: Date,
  clientId: { type: mongoose.Schema.Types.Number, ref: 'Client' },
});

const TransactionModel = mongoose.model('Transaction', Schema);

export default TransactionModel;

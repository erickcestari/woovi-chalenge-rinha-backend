import mongoose from 'mongoose';

const Schema = new mongoose.Schema({
  value: Number,
  type: String,
  description: String,
  performed_at: Date,
});

const TransactionModel = mongoose.model('Transaction', Schema);

export default TransactionModel;

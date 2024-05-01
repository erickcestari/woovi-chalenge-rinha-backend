import mongoose from 'mongoose';
import TransactionModel from '../transaction/transactionModel';

const Schema = new mongoose.Schema({
  id: Number,
  limit: Number,
  balance: Number,
  available: Number,
  last_transactions: [TransactionModel.schema],
});

const ClientModel = mongoose.model('Client', Schema);

export default ClientModel;
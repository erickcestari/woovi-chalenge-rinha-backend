import mongoose from 'mongoose';

const Schema = new mongoose.Schema({
  id: Number,
  limit: Number,
  balance: Number,
  lastTransactions: [{ type: mongoose.Schema.Types.Number, ref: 'Transaction' }],
});

const ClientModel = mongoose.model('Client', Schema);

export default ClientModel;
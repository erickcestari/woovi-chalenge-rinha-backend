import mongoose from 'mongoose';

const Schema = new mongoose.Schema({
  id: Number,
  limit: Number,
  balance: Number,
  available: Number,
  last_transactions: [{ type: mongoose.Schema.Types.Number, ref: 'Transaction' }],
});

const ClientModel = mongoose.model('Client', Schema);

export default ClientModel;
import { Context } from 'koa';
import { Types } from 'mongoose';
import ClientModel from './clientModel';

export const clientGet = async (ctx: Context) => {
  const { id } = ctx.params;

  if (!Types.ObjectId.isValid(id)) {
    ctx.status = 400;
    ctx.body = {
      error: 'id is invalid',
    };
  }

  const client = await ClientModel.findOne({
    _id: id,
  }).lean();

  ctx.body = {
    id: client._id.toString(),
    limit: client.limit,
    balance: client.balance,
    available: client.available,
    last_transactions: client.last_transactions,
  };
  ctx.status = 200;
}

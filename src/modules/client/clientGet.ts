import ClientModel from './clientModel';

export const clientGet = async (id: number) => {
  console.log("aqui deu isso" + id)
  const client = await ClientModel.findOne({
    id: id,
  }).lean();

  if (!client) {
    throw new Error(`No client found with id: ${id}`);
  }

  return {
    id: client.id,
    limit: client.limit,
    balance: client.balance,
    available: client.available,
    last_transactions: client.last_transactions,
  };
}
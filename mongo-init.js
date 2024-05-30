db = connect("mongodb://localhost/rinha");

db.clients.insertMany([
  {
    id: 1,
    limit: 100000,
    balance: 0,
    lastTransactions: [],
  },
  {
    id: 2,
    limit: 80000,
    balance: 0,
    lastTransactions: [],
  },
  {
    id: 3,
    limit: 1000000,
    balance: 0,
    lastTransactions: [],
  },
  {
    id: 4,
    limit: 10000000,
    balance: 0,
    lastTransactions: [],
  },
  {
    id: 5,
    limit: 500000,
    balance: 0,
    lastTransactions: [],
  },
]);
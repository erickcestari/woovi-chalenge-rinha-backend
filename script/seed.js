// Connect to MongoDB
var conn = new Mongo();

// Select database
var db = conn.getDB("your_database_name");

// Drop existing collections if any
db.clientes.drop();
db.transacoes.drop();

// Create collections
db.createCollection("clientes");
db.createCollection("transacoes");

// Insert data into "clientes" collection
db.clientes.insertMany([
  { nome: "Erick", limite: 100000, saldo: 0 },
  { nome: "Vinicius", limite: 80000, saldo: 0 },
  { nome: "Leonardo", limite: 1000000, saldo: 0 },
  { nome: "Bob", limite: 10000000, saldo: 0 },
  { nome: "Tom", limite: 500000, saldo: 0 }
]);
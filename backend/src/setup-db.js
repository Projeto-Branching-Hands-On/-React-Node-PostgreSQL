const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function criarTabela() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS clientes (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(100),
        email VARCHAR(100) UNIQUE,
        telefone VARCHAR(20)
      );
    `);
    console.log("✅ Tabela \"clientes\" criada (ou já existia)");
  } catch (err) {
    console.error("❌ Erro ao criar tabela:", err);
  } finally {
    pool.end();
  }
}

criarTabela();

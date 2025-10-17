const express = require('express');
const { Pool } = require('pg');
const app = express();
app.use(express.json());

// Conexão com PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.connect()
  .then(() => console.log('✅ Conectado ao banco PostgreSQL'))
  .catch((err) => console.error('❌ Erro ao conectar ao banco:', err));

// Rota básica
app.get('/', (req, res) => res.send('Backend + DB funcionando 🚀'));

// Rota para listar clientes (teste inicial)
app.get('/clientes', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM clientes');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Backend rodando na porta ${port}`));

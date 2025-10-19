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

// =====================
// 🧩 ROTAS CRUD CLIENTES
// =====================

// 🔹 READ - listar todos os clientes
app.get('/clientes', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM clientes ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 READ - buscar cliente por ID
app.get('/clientes/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM clientes WHERE id = $1', [id]);
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Cliente não encontrado' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 CREATE - adicionar novo cliente
app.post('/clientes', async (req, res) => {
  const { nome, email, telefone } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO clientes (nome, email, telefone) VALUES ($1, $2, $3) RETURNING *',
      [nome, email, telefone]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 UPDATE - atualizar dados de um cliente
app.put('/clientes/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, email, telefone } = req.body;

  try {
    const result = await pool.query(
      'UPDATE clientes SET nome = $1, email = $2, telefone = $3 WHERE id = $4 RETURNING *',
      [nome, email, telefone, id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Cliente não encontrado' });

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 DELETE - remover cliente
app.delete('/clientes/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM clientes WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Cliente não encontrado' });

    res.json({ message: 'Cliente removido com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Backend rodando na porta ${port}`));

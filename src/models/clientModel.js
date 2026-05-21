const { pool } = require('../config/database');

const mapClientRow = (row) => ({
  id: row.id,
  nome: row.nome,
  telefone: row.telefone,
  email: row.email,
  endereco: row.endereco,
  cidade: row.cidade,
  observacoes: row.observacoes,
  created_at: row.created_at,
  updated_at: row.updated_at,
});

const findAll = async () => {
  const [rows] = await pool.query(
    `SELECT id, nome, telefone, email, endereco, cidade, observacoes, created_at, updated_at
       FROM clientes
      ORDER BY nome ASC`
  );

  return rows.map(mapClientRow);
};

const findById = async (id) => {
  const [rows] = await pool.execute(
    `SELECT id, nome, telefone, email, endereco, cidade, observacoes, created_at, updated_at
       FROM clientes
      WHERE id = ?`,
    [id]
  );

  return rows[0] ? mapClientRow(rows[0]) : null;
};

const create = async (client) => {
  const [result] = await pool.execute(
    `INSERT INTO clientes (
       nome,
       telefone,
       email,
       endereco,
       cidade,
       observacoes
     ) VALUES (?, ?, ?, ?, ?, ?)`,
    [
      client.nome,
      client.telefone,
      client.email,
      client.endereco,
      client.cidade,
      client.observacoes,
    ]
  );

  return findById(result.insertId);
};

const update = async (id, client) => {
  await pool.execute(
    `UPDATE clientes
        SET nome = ?,
            telefone = ?,
            email = ?,
            endereco = ?,
            cidade = ?,
            observacoes = ?
      WHERE id = ?`,
    [
      client.nome,
      client.telefone,
      client.email,
      client.endereco,
      client.cidade,
      client.observacoes,
      id,
    ]
  );

  return findById(id);
};

const remove = async (id) => {
  const [result] = await pool.execute(
    `DELETE FROM clientes
      WHERE id = ?`,
    [id]
  );

  return result.affectedRows > 0;
};

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove,
};

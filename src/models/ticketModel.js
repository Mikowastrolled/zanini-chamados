const { pool } = require('../config/database');

const mapTicketRow = (row) => ({
  id: row.id,
  clienteNome: row.cliente_nome,
  clienteTelefone: row.cliente_telefone,
  clienteEmail: row.cliente_email,
  equipamento: row.equipamento,
  descricao: row.descricao,
  prioridade: row.prioridade,
  status: row.status,
  tecnicoResponsavel: row.tecnico_responsavel,
  criadoEm: row.criado_em,
  atualizadoEm: row.atualizado_em,
});

const findAll = async () => {
  const [rows] = await pool.query(
    `SELECT id, cliente_nome, cliente_telefone, cliente_email, equipamento,
            descricao, prioridade, status, tecnico_responsavel, criado_em, atualizado_em
       FROM chamados
      ORDER BY criado_em DESC`
  );

  return rows.map(mapTicketRow);
};

const findById = async (id) => {
  const [rows] = await pool.execute(
    `SELECT id, cliente_nome, cliente_telefone, cliente_email, equipamento,
            descricao, prioridade, status, tecnico_responsavel, criado_em, atualizado_em
       FROM chamados
      WHERE id = ?`,
    [id]
  );

  return rows[0] ? mapTicketRow(rows[0]) : null;
};

const create = async (ticket) => {
  const [result] = await pool.execute(
    `INSERT INTO chamados (
       cliente_nome,
       cliente_telefone,
       cliente_email,
       equipamento,
       descricao,
       prioridade,
       status,
       tecnico_responsavel
     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      ticket.clienteNome,
      ticket.clienteTelefone,
      ticket.clienteEmail,
      ticket.equipamento,
      ticket.descricao,
      ticket.prioridade,
      ticket.status,
      ticket.tecnicoResponsavel,
    ]
  );

  return findById(result.insertId);
};

const updateStatus = async (id, status) => {
  const [result] = await pool.execute(
    `UPDATE chamados
        SET status = ?
      WHERE id = ?`,
    [status, id]
  );

  return result.affectedRows > 0 ? findById(id) : null;
};

module.exports = {
  findAll,
  findById,
  create,
  updateStatus,
};

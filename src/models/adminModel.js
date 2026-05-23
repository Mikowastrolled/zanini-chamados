const { pool } = require('../config/database');

const mapAdminRow = (row) => ({
  id: row.id,
  nome: row.nome,
  email: row.email,
  senhaHash: row.senha_hash,
  created_at: row.created_at,
  updated_at: row.updated_at,
});

const sanitizeAdmin = (admin) => {
  if (!admin) {
    return null;
  }

  const { senhaHash, ...safeAdmin } = admin;
  return safeAdmin;
};

const findById = async (id) => {
  const [rows] = await pool.execute(
    `SELECT id, nome, email, senha_hash, created_at, updated_at
       FROM admins
      WHERE id = ?`,
    [id]
  );

  return rows[0] ? mapAdminRow(rows[0]) : null;
};

const findByEmail = async (email) => {
  const [rows] = await pool.execute(
    `SELECT id, nome, email, senha_hash, created_at, updated_at
       FROM admins
      WHERE email = ?`,
    [email]
  );

  return rows[0] ? mapAdminRow(rows[0]) : null;
};

const create = async (admin) => {
  const [result] = await pool.execute(
    `INSERT INTO admins (
       nome,
       email,
       senha_hash
     ) VALUES (?, ?, ?)`,
    [admin.nome, admin.email, admin.senhaHash]
  );

  return findById(result.insertId);
};

module.exports = {
  findById,
  findByEmail,
  create,
  sanitizeAdmin,
};

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { env } = require('../config/env');
const adminModel = require('../models/adminModel');

const createHttpError = (statusCode, message) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const normalizeText = (value) => {
  if (typeof value !== 'string') {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};

const normalizeEmail = (value) => {
  const email = normalizeText(value);
  return email ? email.toLowerCase() : null;
};

const validateCredentialsPayload = (payload = {}) => {
  const email = normalizeEmail(payload.email);
  const senha = normalizeText(payload.senha);

  if (!email || !senha) {
    throw createHttpError(400, 'email e senha sao obrigatorios.');
  }

  return { email, senha };
};

const signToken = (admin) =>
  jwt.sign(
    {
      sub: admin.id,
      email: admin.email,
      nome: admin.nome,
    },
    env.auth.jwtSecret,
    { expiresIn: env.auth.jwtExpiresIn }
  );

const registerAdmin = async (payload = {}) => {
  const nome = normalizeText(payload.nome);
  const { email, senha } = validateCredentialsPayload(payload);

  if (!nome) {
    throw createHttpError(400, 'nome e obrigatorio.');
  }

  if (senha.length < 6) {
    throw createHttpError(400, 'senha deve ter pelo menos 6 caracteres.');
  }

  const existingAdmin = await adminModel.findByEmail(email);

  if (existingAdmin) {
    throw createHttpError(409, 'Email ja cadastrado.');
  }

  const senhaHash = await bcrypt.hash(senha, env.auth.bcryptSaltRounds);
  const admin = await adminModel.create({ nome, email, senhaHash });
  const safeAdmin = adminModel.sanitizeAdmin(admin);

  return {
    admin: safeAdmin,
    token: signToken(safeAdmin),
  };
};

const loginAdmin = async (payload = {}) => {
  const { email, senha } = validateCredentialsPayload(payload);
  const admin = await adminModel.findByEmail(email);

  if (!admin) {
    throw createHttpError(401, 'Credenciais invalidas.');
  }

  const isValidPassword = await bcrypt.compare(senha, admin.senhaHash);

  if (!isValidPassword) {
    throw createHttpError(401, 'Credenciais invalidas.');
  }

  const safeAdmin = adminModel.sanitizeAdmin(admin);

  return {
    admin: safeAdmin,
    token: signToken(safeAdmin),
  };
};

module.exports = {
  loginAdmin,
  registerAdmin,
};

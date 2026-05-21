const clientModel = require('../models/clientModel');

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

const validateId = (id) => {
  const parsedId = Number(id);

  if (!Number.isInteger(parsedId) || parsedId <= 0) {
    throw createHttpError(400, 'ID do cliente invalido.');
  }

  return parsedId;
};

const validateRequiredFields = (payload) => {
  const nome = normalizeText(payload.nome);
  const telefone = normalizeText(payload.telefone);

  if (!nome || !telefone) {
    throw createHttpError(400, 'nome e telefone sao obrigatorios.');
  }

  return {
    nome,
    telefone,
  };
};

const normalizeClientPayload = (payload = {}) => {
  const requiredFields = validateRequiredFields(payload);

  return {
    ...requiredFields,
    email: normalizeText(payload.email),
    endereco: normalizeText(payload.endereco),
    cidade: normalizeText(payload.cidade),
    observacoes: normalizeText(payload.observacoes),
  };
};

const ensureClientExists = async (id) => {
  const clientId = validateId(id);
  const client = await clientModel.findById(clientId);

  if (!client) {
    throw createHttpError(404, 'Cliente nao encontrado.');
  }

  return client;
};

const listClients = () => clientModel.findAll();

const getClientById = async (id) => ensureClientExists(id);

const createClient = async (payload = {}) => {
  const client = normalizeClientPayload(payload);
  return clientModel.create(client);
};

const updateClient = async (id, payload = {}) => {
  const clientId = validateId(id);
  await ensureClientExists(clientId);

  const client = normalizeClientPayload(payload);
  return clientModel.update(clientId, client);
};

const deleteClient = async (id) => {
  const clientId = validateId(id);
  await ensureClientExists(clientId);

  const deleted = await clientModel.remove(clientId);

  if (!deleted) {
    throw createHttpError(404, 'Cliente nao encontrado.');
  }

  return deleted;
};

module.exports = {
  listClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
};

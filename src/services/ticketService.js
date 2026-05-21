const ticketModel = require('../models/ticketModel');

const validStatuses = ['aberto', 'em_andamento', 'aguardando_cliente', 'concluido', 'cancelado'];
const validPriorities = ['baixa', 'media', 'alta', 'urgente'];

const createHttpError = (statusCode, message) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const ensureTicketExists = async (id) => {
  const ticket = await ticketModel.findById(id);

  if (!ticket) {
    throw createHttpError(404, 'Chamado nao encontrado.');
  }

  return ticket;
};

const listTickets = () => ticketModel.findAll();

const getTicketById = async (id) => ensureTicketExists(id);

const createTicket = async (payload) => {
  if (!payload.clienteNome || !payload.clienteTelefone || !payload.descricao) {
    throw createHttpError(400, 'clienteNome, clienteTelefone e descricao sao obrigatorios.');
  }

  const prioridade = payload.prioridade || 'media';
  const status = payload.status || 'aberto';

  if (!validPriorities.includes(prioridade)) {
    throw createHttpError(400, 'Prioridade invalida.');
  }

  if (!validStatuses.includes(status)) {
    throw createHttpError(400, 'Status invalido.');
  }

  return ticketModel.create({
    clienteNome: payload.clienteNome,
    clienteTelefone: payload.clienteTelefone,
    clienteEmail: payload.clienteEmail || null,
    equipamento: payload.equipamento || null,
    descricao: payload.descricao,
    prioridade,
    status,
    tecnicoResponsavel: payload.tecnicoResponsavel || null,
  });
};

const updateTicketStatus = async (id, status) => {
  if (!validStatuses.includes(status)) {
    throw createHttpError(400, 'Status invalido.');
  }

  const ticket = await ticketModel.updateStatus(id, status);

  if (!ticket) {
    throw createHttpError(404, 'Chamado nao encontrado.');
  }

  return ticket;
};

module.exports = {
  listTickets,
  getTicketById,
  createTicket,
  updateTicketStatus,
};

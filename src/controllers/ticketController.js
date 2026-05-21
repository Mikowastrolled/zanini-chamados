const ticketService = require('../services/ticketService');

const listTickets = async (req, res, next) => {
  try {
    const tickets = await ticketService.listTickets();
    return res.status(200).json({ data: tickets });
  } catch (error) {
    return next(error);
  }
};

const getTicketById = async (req, res, next) => {
  try {
    const ticket = await ticketService.getTicketById(req.params.id);
    return res.status(200).json({ data: ticket });
  } catch (error) {
    return next(error);
  }
};

const createTicket = async (req, res, next) => {
  try {
    const ticket = await ticketService.createTicket(req.body);
    return res.status(201).json({ data: ticket });
  } catch (error) {
    return next(error);
  }
};

const updateTicketStatus = async (req, res, next) => {
  try {
    const ticket = await ticketService.updateTicketStatus(req.params.id, req.body.status);
    return res.status(200).json({ data: ticket });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  listTickets,
  getTicketById,
  createTicket,
  updateTicketStatus,
};

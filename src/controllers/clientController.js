const clientService = require('../services/clientService');

const listClients = async (req, res, next) => {
  try {
    const clients = await clientService.listClients();
    return res.status(200).json({ data: clients });
  } catch (error) {
    return next(error);
  }
};

const getClientById = async (req, res, next) => {
  try {
    const client = await clientService.getClientById(req.params.id);
    return res.status(200).json({ data: client });
  } catch (error) {
    return next(error);
  }
};

const createClient = async (req, res, next) => {
  try {
    const client = await clientService.createClient(req.body);
    return res.status(201).json({ data: client });
  } catch (error) {
    return next(error);
  }
};

const updateClient = async (req, res, next) => {
  try {
    const client = await clientService.updateClient(req.params.id, req.body);
    return res.status(200).json({ data: client });
  } catch (error) {
    return next(error);
  }
};

const deleteClient = async (req, res, next) => {
  try {
    await clientService.deleteClient(req.params.id);
    return res.status(200).json({ message: 'Cliente deletado com sucesso.' });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  listClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
};

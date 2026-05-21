const { Router } = require('express');
const clientController = require('../controllers/clientController');

const router = Router();

router.get('/', clientController.listClients);
router.get('/:id', clientController.getClientById);
router.post('/', clientController.createClient);
router.put('/:id', clientController.updateClient);
router.delete('/:id', clientController.deleteClient);

module.exports = router;

const { Router } = require('express');
const ticketController = require('../controllers/ticketController');

const router = Router();

router.get('/', ticketController.listTickets);
router.get('/:id', ticketController.getTicketById);
router.post('/', ticketController.createTicket);
router.patch('/:id/status', ticketController.updateTicketStatus);

module.exports = router;

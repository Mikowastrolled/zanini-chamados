const { Router } = require('express');
const clientRoutes = require('./clientRoutes');
const healthRoutes = require('./healthRoutes');
const ticketRoutes = require('./ticketRoutes');

const router = Router();

router.use('/health', healthRoutes);
router.use('/chamados', ticketRoutes);
router.use('/clientes', clientRoutes);

module.exports = router;

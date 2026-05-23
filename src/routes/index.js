const { Router } = require('express');
const authRoutes = require('./authRoutes');
const clientRoutes = require('./clientRoutes');
const healthRoutes = require('./healthRoutes');
const ticketRoutes = require('./ticketRoutes');
const authenticate = require('../middlewares/authMiddleware');

const router = Router();

router.use('/auth', authRoutes);
router.use('/health', healthRoutes);
router.use('/chamados', authenticate, ticketRoutes);
router.use('/clientes', authenticate, clientRoutes);

module.exports = router;

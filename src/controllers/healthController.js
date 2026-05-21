const { pool } = require('../config/database');

const checkHealth = async (req, res, next) => {
  try {
    await pool.query('SELECT 1');

    return res.status(200).json({
      status: 'ok',
      service: 'Zanini-Chamados API',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  checkHealth,
};

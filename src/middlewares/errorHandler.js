const { env } = require('../config/env');

const errorHandler = (error, req, res, next) => {
  const statusCode = error.statusCode || 500;

  if (statusCode >= 500) {
    console.error(error);
  }

  return res.status(statusCode).json({
    error: {
      message: statusCode === 500 ? 'Erro interno do servidor.' : error.message,
      statusCode,
      ...(env.nodeEnv === 'development' && { stack: error.stack }),
    },
  });
};

module.exports = errorHandler;

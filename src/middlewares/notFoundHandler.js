const notFoundHandler = (req, res, next) => {
  const error = new Error(`Rota nao encontrada: ${req.method} ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

module.exports = notFoundHandler;

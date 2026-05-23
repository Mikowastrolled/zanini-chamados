const jwt = require('jsonwebtoken');
const { env } = require('../config/env');
const adminModel = require('../models/adminModel');

const createHttpError = (statusCode, message) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const getTokenFromHeader = (authorizationHeader) => {
  if (!authorizationHeader) {
    return null;
  }

  const [scheme, token] = authorizationHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return null;
  }

  return token;
};

const authenticate = async (req, res, next) => {
  try {
    const token = getTokenFromHeader(req.headers.authorization);

    if (!token) {
      throw createHttpError(401, 'Token de autenticacao nao informado.');
    }

    const decodedToken = jwt.verify(token, env.auth.jwtSecret);
    const admin = await adminModel.findById(decodedToken.sub);

    if (!admin) {
      throw createHttpError(401, 'Token de autenticacao invalido.');
    }

    req.admin = adminModel.sanitizeAdmin(admin);
    return next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return next(createHttpError(401, 'Token de autenticacao invalido.'));
    }

    return next(error);
  }
};

module.exports = authenticate;

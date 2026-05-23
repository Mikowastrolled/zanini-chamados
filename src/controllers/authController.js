const authService = require('../services/authService');

const register = async (req, res, next) => {
  try {
    const authData = await authService.registerAdmin(req.body);
    return res.status(201).json({ data: authData });
  } catch (error) {
    return next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const authData = await authService.loginAdmin(req.body);
    return res.status(200).json({ data: authData });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  register,
  login,
};

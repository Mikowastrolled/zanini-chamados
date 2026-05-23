const dotenv = require('dotenv');

dotenv.config();

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 3000,
  corsOrigin: process.env.CORS_ORIGIN || '*',
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    name: process.env.DB_NAME || 'zanini_chamados',
  },
  auth: {
    jwtSecret: process.env.JWT_SECRET || 'zanini_chamados_dev_secret',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '8h',
    bcryptSaltRounds: Number(process.env.BCRYPT_SALT_ROUNDS) || 10,
  },
};

module.exports = { env };

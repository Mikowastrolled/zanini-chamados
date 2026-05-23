const express = require('express');
const cors = require('cors');
const { env } = require('./config/env');
const routes = require('./routes');
const notFoundHandler = require('./middlewares/notFoundHandler');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

const isAllowedOrigin = (origin) => !origin || env.corsOrigins.includes('*') || env.corsOrigins.includes(origin);

const corsOptions = {
  origin: (origin, callback) => {
    if (isAllowedOrigin(origin)) {
      return callback(null, true);
    }

    const error = new Error('Origem nao permitida pelo CORS.');
    error.statusCode = 403;
    return callback(error);
  },
  credentials: env.corsCredentials,
};

app.use(cors(corsOptions));
app.use(express.json());

app.use('/api', routes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;

const app = require('./src/app');
const { env } = require('./src/config/env');
const { testConnection } = require('./src/config/database');

const startServer = async () => {
  try {
    await testConnection();

    app.listen(env.port, () => {
      console.log(`Servidor Zanini-Chamados rodando na porta ${env.port}`);
    });
  } catch (error) {
    console.error('Erro ao iniciar o servidor:', error.message);
    process.exit(1);
  }
};

startServer();

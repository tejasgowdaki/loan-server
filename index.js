require('dotenv').config();

const expressApp = require('./src/expressApp');
const logger = require('./src/config/logger');

process.on('SIGINT', () => {
  logger.error('process exit on SIGINT');
  process.exit(0);
});

process.on('SIGTERM', () => {
  logger.error('process exit on SIGTERM');
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  // TODO: check if logging to file
  logger.error(error.stack);
  process.exit(1);
});

process.on('unhandledRejection', (error) => {
  // TODO: check if logging to file
  logger.error(error.stack);
  process.exit(1);
});

process.on('exit', (code) => {
  logger.info(`process exit code: ${process.env.PORT}`);
});

expressApp.listen(process.env.PORT, () => {
  logger.info(`Listening on port ${process.env.PORT}...`);
});

const mongoose = require('mongoose');

const logger = require('../config/logger');

const mongooseOptions = {
  poolSize: 3,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
};

mongoose.Promise = global.Promise;
const db = mongoose.createConnection(process.env.DB_URL, mongooseOptions);

mongoose.connection.on('connected', () => {
  logger.info('Mongoose default connection open');
});

mongoose.connection.on('error', error => {
  logger.error('Mongoose default connection error', error);
});

mongoose.connection.on('disconnected', () => {
  logger.info('Mongoose default connection disconnected');
});

process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    logger.info('Mongoose default connection disconnected through app termination');
    process.exit(0);
  });
});

module.exports = db;

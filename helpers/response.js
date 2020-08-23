const logger = require('../config/logger');

const userErrorMessage = 'Is this unprecedented?. Press the magic button';

const success = (data = {}) => ({ success: true, ...data });

const error = (errorObject, message = null, data = {}) => {
  let errorMessage = '';
  if (errorObject) {
    logger.error(errorObject.stack);

    errorMessage = errorObject.message;
  }

  return {
    success: false,
    message: message || errorMessage || userErrorMessage,
    ...data
  };
};

const apiError = (err, req, res, next) => {
  res.status(err.status || 401).json(error(err));
};

module.exports = { success, error, apiError };

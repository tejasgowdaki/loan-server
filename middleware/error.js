const logger = require('../config/logger');

module.exports = (error, req, res, next) => {
  logger.error(error.stack);

  res.status(error.status || 500).json({
    success: false,
    message: error.status ? error.message : "Something doesn't add up here, please try again"
  });
};

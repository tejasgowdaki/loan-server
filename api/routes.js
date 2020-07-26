const express = require('express');

const { apiError } = require('../helpers/response');

const memberRouter = require('./member/routes');
const savingRouter = require('./saving/routes');
const loanRouter = require('./loan/routes');

const router = (app) => {
  const mainRouter = express.Router();

  mainRouter.use('/members', memberRouter, apiError);
  mainRouter.use('/savings', savingRouter, apiError);
  mainRouter.use('/loans', loanRouter, apiError);

  // If no routes matches
  mainRouter.use((req, res, next) => {
    if (!req.route) {
      const error = new Error('No route matched');
      error.status = 404;
      return next(error);
    }

    next();
  });

  app.use('/api', mainRouter);
};

module.exports = router;

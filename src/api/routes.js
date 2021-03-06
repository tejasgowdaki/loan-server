const express = require('express');

const authenticate = require('../middleware/auth');

const { apiError } = require('../helpers/response');

const authRouter = require('./auth/routes');
const accountRouter = require('./account/routes');
const memberRouter = require('./member/routes');
const savingRouter = require('./saving/routes');
const loanRouter = require('./loan/routes');
const transactionRouter = require('./transaction/routes');
const statsRouter = require('./stats/routes');
const chitRouter = require('./chit/routes');

const router = (app) => {
  const mainRouter = express.Router();

  mainRouter.use('/auth', authRouter, apiError);
  mainRouter.use('/accounts', authenticate, accountRouter, apiError);
  mainRouter.use('/members', authenticate, memberRouter, apiError);
  mainRouter.use('/savings', authenticate, savingRouter, apiError);
  mainRouter.use('/loans', authenticate, loanRouter, apiError);
  mainRouter.use('/transactions', authenticate, transactionRouter, apiError);
  mainRouter.use('/stats', authenticate, statsRouter, apiError);
  mainRouter.use('/chits', authenticate, chitRouter, apiError);

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

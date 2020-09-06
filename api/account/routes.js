const express = require('express');

const accountRouter = express.Router();

const async = require('../../middleware/async');

const account = require('./index');

accountRouter.get('/', async(account.fetchAll));

accountRouter.get('/:id', async(account.fetchOne));

accountRouter.post('/', async(account.create));

module.exports = accountRouter;

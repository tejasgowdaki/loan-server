const express = require('express');

const accountRouter = express.Router();

const async = require('../../middleware/async');

const account = require('./index');

accountRouter.get('/', async(account.fetchAll));

accountRouter.get('/:id', async(account.fetchOne));

accountRouter.post('/switch-account', async(account.switchAccount));

accountRouter.post('/', async(account.create));

accountRouter.put('/:id', async(account.update));

module.exports = accountRouter;

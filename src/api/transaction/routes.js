const express = require('express');

const transactionRouter = express.Router();

const async = require('../../middleware/async');

const transaction = require('./index');

transactionRouter.get('/', async(transaction.fetchAll));

transactionRouter.post('/', async(transaction.create));

transactionRouter.delete('/:id', async(transaction.delete));

module.exports = transactionRouter;

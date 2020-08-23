const express = require('express');

const loanRouter = express.Router();

const async = require('../../middleware/async');

const loan = require('./index');

loanRouter.get('/', async(loan.fetchAll));

loanRouter.post('/', async(loan.create));

loanRouter.put('/:id', async(loan.update));

loanRouter.delete('/:id', async(loan.delete));

loanRouter.post('/add/:id', async(loan.addPayment));

loanRouter.post('/delete/:id', async(loan.deletePayment));

module.exports = loanRouter;

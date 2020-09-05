const express = require('express');

const loanRouter = express.Router();

const async = require('../../middleware/async');

const loan = require('./index');

loanRouter.get('/', async(loan.fetchAll));

loanRouter.post('/', async(loan.create));

loanRouter.post('/sub-loan/:id', async(loan.updateSubLoan));

loanRouter.delete('/sub-loan/:id/:subLoanId', async(loan.deleteSubLoan));

loanRouter.put('/:id', async(loan.update));

loanRouter.delete('/:id', async(loan.delete));

loanRouter.post('/add/:id', async(loan.addPayment));

loanRouter.post('/delete/:id', async(loan.deletePayment));

module.exports = loanRouter;

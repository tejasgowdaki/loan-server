const express = require('express');

const loanRouter = express.Router();

const loan = require('./index');

loanRouter.get('/', loan.fetchAll);

loanRouter.post('/', loan.create);

loanRouter.put('/:id', loan.update);

loanRouter.delete('/:id', loan.delete);

loanRouter.post('/add/:id', loan.addPayment);

loanRouter.post('/delete/:id', loan.deletePayment);

module.exports = loanRouter;

const express = require('express');

const loanRouter = express.Router();

const loan = require('./index');

loanRouter.get('/', loan.fetchAll);

loanRouter.post('/', loan.create);

loanRouter.put('/:id', loan.update);

loanRouter.delete('/:id', loan.delete);

module.exports = loanRouter;

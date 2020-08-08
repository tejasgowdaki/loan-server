const express = require('express');

const savingRouter = express.Router();

const saving = require('./index');

savingRouter.get('/', saving.fetchAll);

savingRouter.post('/add/:id', saving.addDeposit);

savingRouter.post('/delete/:id', saving.deleteDeposit);

module.exports = savingRouter;

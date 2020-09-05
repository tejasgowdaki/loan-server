const express = require('express');

const savingRouter = express.Router();

const async = require('../../middleware/async');

const saving = require('./index');

savingRouter.get('/', async(saving.fetchAll));

savingRouter.post('/add/:id', async(saving.addDeposit));

savingRouter.post('/delete/:id', async(saving.deleteDeposit));

savingRouter.post('/bulk', async(saving.bulkAddDeposit));

module.exports = savingRouter;

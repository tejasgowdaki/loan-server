const express = require('express');

const chitRouter = express.Router();

const async = require('../../middleware/async');

const chit = require('./index');

chitRouter.get('/', async(chit.fetchAll));

chitRouter.post('/', async(chit.create));

chitRouter.delete('/:id', async(chit.delete));

module.exports = chitRouter;

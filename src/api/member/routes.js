const express = require('express');

const memberRouter = express.Router();

const async = require('../../middleware/async');

const member = require('./index');

memberRouter.get('/', async(member.fetchAll));

memberRouter.post('/', async(member.create));

memberRouter.put('/:id', async(member.update));

memberRouter.delete('/:id', async(member.delete));

module.exports = memberRouter;

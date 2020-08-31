const express = require('express');

const statsRouter = express.Router();

const async = require('../../middleware/async');

const stats = require('./index');

statsRouter.get('/', async(stats.fetchStats));

module.exports = statsRouter;

const express = require("express");

const { apiError } = require("../helpers/response");

const memberRouter = require("./member/routes");

const apiRoutes = express.Router();

apiRoutes.use("/members", memberRouter, apiError);

module.exports = apiRoutes;

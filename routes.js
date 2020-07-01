const express = require("express");

const { apiError } = require("./helpers/response");

const memberRouter = require("./api/member/routes");

const router = app => {
  const apiRoutes = express.Router();

  apiRoutes.use("/members", memberRouter, apiError);

  // If no routes matches
  apiRoutes.use((req, res, next) => {
    if (!req.route) {
      const error = new Error("No route matched");
      error.status = 404;
      return next(error);
    }

    next();
  });
};

module.exports = router;

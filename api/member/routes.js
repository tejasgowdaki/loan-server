const express = require("express");

const memberRouter = express.Router();

const member = require("./index");

memberRouter.get("/", member.fetchAll);

memberRouter.post("/", member.create);

memberRouter.put("/:id", member.update);

memberRouter.delete("/:id", member.delete);

module.exports = memberRouter;

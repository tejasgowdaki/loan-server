const response = require('../../helpers/response');

const { Transaction } = require('../../models');

const { validatePresence, validate } = require('./service');

const fetchAll = async (req, res) => {
  const transactions = await Transaction.find({ accountId: req.account._id });
  res.status(200).json(response.success({ transactions }));
};

const create = async (req, res) => {
  const { amount = 0, date = null, type = null, comment = null } = req.body;

  const createObject = { amount, date, type, comment, accountId: req.account._id };

  await validate(createObject);

  const transaction = await Transaction.create(createObject);

  res.status(201).json(response.success({ transaction }));
};

const destroy = async (req, res) => {
  const existingTransaction = await validatePresence(req.params.id);

  await Transaction.deleteOne({ _id: req.params.id });
  res.status(200).json(response.success({ transactionId: req.params.id }));
};

module.exports = { fetchAll, create, delete: destroy };

const response = require('../../helpers/response');

const { Account, User } = require('../../models');

const { validate } = require('./service');

const sendSMS = require('../../helpers/sms');
const { generateJwtToken } = require('../auth/service');

const fetchAll = async (req, res) => {
  const accounts = await Account.find({ userId: req.user._id }).lean();
  res.status(200).json(response.success({ accounts }));
};

const fetchOne = async (req, res) => {
  const account = await Account.findOne({ _id: req.params.id }).lean();

  if (!account) {
    let error = new Error('Account not found');
    error.status = 404;
    throw error;
  }

  res.status(200).json(response.success({ account }));
};

const create = async (req, res) => {
  const name = (req.body.name || '').trim();
  const type = req.body.type;
  const startDate = req.body.startDate;
  const config = req.body.config;

  await validate({ name, type, userId: req.user._id });

  const account = await Account.create({ name, userId: req.user._id, type, config, startDate });

  sendSMS(`A new account has been created in Loan Manager with Name: ${name}`, [process.env.NOTIFY_MOBILE]);

  res.status(201).json(response.success({ account }));
};

const update = async (req, res) => {
  const existingAccount = await Account.findOne({ _id: req.params.id });

  if (!existingAccount) {
    let error = new Error('Account not found');
    error.status = 404;
    throw error;
  }

  const name = (req.body.name || '').trim();
  const startDate = req.body.startDate;
  const config = req.body.config;

  await validate({ name }, req.params.id);

  const account = await Account.findByIdAndUpdate(req.params.id, { name, config, startDate }, { new: true });

  res.status(200).json(response.success({ account }));
};

const switchAccount = async (req, res) => {
  const activeAccountId = req.body.accountId;

  const user = await User.findByIdAndUpdate(req.user._id, { activeAccountId }, { new: true });

  const token = generateJwtToken({
    _id: req.user._id,
    activeAccountId
  });

  res.status(200).json(response.success({ token }));
};

module.exports = { fetchAll, fetchOne, create, update, switchAccount };

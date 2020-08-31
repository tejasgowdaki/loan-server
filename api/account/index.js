const response = require('../../helpers/response');

const { Account } = require('../../models');

const { validate } = require('./service');

const sendSMS = require('../../helpers/sms');

const fetchAll = async (req, res) => {
  const accounts = await Account.find();
  res.status(200).json(response.success({ accounts }));
};

const fetchOne = async (req, res) => {
  const account = await Account.findOne({ _id: req.params.id });

  if (!account) {
    let error = new Error('Account not found');
    error.status = 404;
    throw error;
  }

  res.status(200).json(response.success({ account }));
};

const create = async (req, res) => {
  const name = (req.body.name || '').trim();
  const mobile = (req.body.mobile || '').trim();

  await validate({ name, mobile });

  const account = await Account.create({ name, mobile });

  sendSMS(`A new account has been created in Loan Manager with Name: ${name} and Mobile: ${mobile}`, [
    process.env.NOTIFY_MOBILE
  ]);

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
  const mobile = (req.body.mobile || '').trim();

  await validate({ name, mobile }, req.params.id);

  const account = await Account.findByIdAndUpdate(req.params.id, { name, mobile }, { new: true });

  res.status(200).json(response.success({ account }));
};

module.exports = { fetchAll, fetchOne, create, update };

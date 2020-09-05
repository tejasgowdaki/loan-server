const response = require('../../helpers/response');

const { Saving, Member } = require('../../models');

const {
  validatePresence,
  validate,
  validateDepositDelete,
  constructCreateObject,
  constructDeleteDepositObject
} = require('./service');

const sendSMS = require('../../helpers/sms');

const fetchAll = async (req, res) => {
  const savings = await Saving.find({ accountId: req.account._id });

  res.status(200).json(response.success({ savings }));
};

const addDeposit = async (req, res) => {
  const existingSaving = await validatePresence(req.params.id);

  const { memberId = null, amount = 0, date = null } = req.body;

  await validate({ memberId, amount, date });

  const updateObject = constructCreateObject(amount, date, { ...existingSaving });

  const saving = await Saving.findByIdAndUpdate(req.params.id, updateObject, {
    new: true
  });

  // if (req.account.isSmsEnabled) {
  //   const member = await Member.findOne({ _id: saving.memberId });
  //   sendSMS(`Hello ${member.name}, a savings deposit has been made in ${req.account.name} of Rs. ${amount} for you`, [
  //     member.mobile
  //   ]);
  // }

  res.status(201).json(response.success({ saving }));
};

const deleteDeposit = async (req, res) => {
  const existingSaving = await validatePresence(req.params.id);

  const { depositId = null } = req.body;

  validateDepositDelete(depositId);

  const updateObject = constructDeleteDepositObject(depositId, existingSaving);

  const saving = await Saving.findByIdAndUpdate(req.params.id, updateObject, {
    new: true
  });

  res.status(200).json(response.success({ saving }));
};

module.exports = { fetchAll, addDeposit, deleteDeposit };

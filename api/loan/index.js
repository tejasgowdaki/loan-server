const response = require('../../helpers/response');

const { Loan, Member } = require('../../models');

const {
  validatePresence,
  validate,
  validatePayment,
  validatePaymentDelete,
  constructCreateSubLoanObject,
  constructUpdateSubLoanObject,
  constructDeleteSubLoanObject,
  constructCreatePaymentObject,
  constructDeletePaymentObject
} = require('./service');

const sendSMS = require('../../helpers/sms');

const fetchAll = async (req, res) => {
  const loans = await Loan.find({ accountId: req.account._id });

  res.status(200).json(response.success({ loans }));
};

const create = async (req, res) => {
  const { memberId = null, amount = null, date = null } = req.body;

  await validate({ memberId, amount, date, accountId: req.account._id });

  const createObject = constructCreateSubLoanObject(amount, date);

  const loan = await Loan.create({ memberId, accountId: req.account._id, ...createObject });

  // if (req.account.isSmsEnabled) {
  //   const member = await Member.findOne({ _id: loan.memberId });
  //   sendSMS(`Hello ${member.name}, a loan has been granted for you from ${req.account.name} of Rs. ${amount}`, [
  //     member.mobile
  //   ]);
  // }

  res.status(201).json(response.success({ loan }));
};

const updateSubLoan = async (req, res) => {
  const existingLoan = await validatePresence(req.params.id);

  const { _id, amount = null, date = null } = req.body;

  await validate({ amount, date }, req.params.id);

  const updateObject = constructUpdateSubLoanObject(_id, amount, date, existingLoan);

  const loan = await Loan.findByIdAndUpdate(req.params.id, updateObject, {
    new: true
  });

  // if (req.account.isSmsEnabled) {
  //   const member = await Member.findOne({ _id: loan.memberId });
  //   sendSMS(`Hello ${member.name}, a loan has been granted for you from ${req.account.name} of Rs. ${amount}`, [
  //     member.mobile
  //   ]);
  // }

  res.status(201).json(response.success({ loan }));
};

const deleteSubLoan = async (req, res) => {
  const existingLoan = await validatePresence(req.params.id);

  const updateObject = constructDeleteSubLoanObject(req.params.subLoanId, existingLoan);

  const loan = await Loan.findByIdAndUpdate(req.params.id, updateObject, {
    new: true
  });

  // if (req.account.isSmsEnabled) {
  //   const member = await Member.findOne({ _id: loan.memberId });
  //   sendSMS(`Hello ${member.name}, a loan has been granted for you from ${req.account.name} of Rs. ${amount}`, [
  //     member.mobile
  //   ]);
  // }

  res.status(201).json(response.success({ loan }));
};

const update = async (req, res) => {
  const amount = req.body.amount;
  const date = req.body.date;

  await validate({ amount, date }, req.params.id);

  const loan = await Loan.findByIdAndUpdate(req.params.id, { amount, date }, { new: true });

  res.status(200).json(response.success({ loan }));
};

const destroy = async (req, res) => {
  await validatePresence(req.params.id);

  await Loan.deleteOne({ _id: req.params.id });

  res.status(200).json(response.success({ loanId: req.params.id }));
};

const addPayment = async (req, res) => {
  const existingLoan = await validatePresence(req.params.id);

  const { amount = 0, date = null, interest = 0 } = req.body;

  await validatePayment({ amount, interest, date }, existingLoan);

  const updateObject = constructCreatePaymentObject(amount, interest, date, { ...existingLoan });

  const loan = await Loan.findByIdAndUpdate(req.params.id, updateObject, {
    new: true
  });

  // if (req.account.isSmsEnabled) {
  //   const member = await Member.findOne({ _id: loan.memberId });
  //   sendSMS(`Hello ${member.name}, a loan payment has been made from you to ${req.account.name} of Rs. ${amount}`, [
  //     member.mobile
  //   ]);
  // }

  res.status(200).json(response.success({ loan }));
};

const deletePayment = async (req, res) => {
  const existingLoan = await validatePresence(req.params.id);

  const { paymentId = null } = req.body;

  validatePaymentDelete(paymentId);

  const updateObject = constructDeletePaymentObject(paymentId, existingLoan);

  const loan = await Loan.findByIdAndUpdate(req.params.id, updateObject, {
    new: true
  });

  res.status(200).json(response.success({ loan }));
};

module.exports = { fetchAll, create, updateSubLoan, deleteSubLoan, update, delete: destroy, addPayment, deletePayment };

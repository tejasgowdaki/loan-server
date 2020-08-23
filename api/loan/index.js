const response = require('../../helpers/response');

const { Loan } = require('../../models');

const {
  validatePresence,
  validate,
  validatePayment,
  validatePaymentDelete,
  constructCreatePaymentObject,
  constructDeletePaymentObject
} = require('./service');

const fetchAll = async (req, res) => {
  const loans = await Loan.find();

  res.status(200).json(response.success({ loans }));
};

const create = async (req, res) => {
  const memberId = req.body.memberId;
  const amount = req.body.amount;
  const date = req.body.date;

  await validate({ memberId, amount, date });

  const loan = await Loan.create({ memberId, amount, date });

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

  const { amount, date, interest } = req.body;

  await validatePayment({ amount, date }, existingLoan);

  const updateObject = constructCreatePaymentObject(amount, interest, date, { ...existingLoan });

  const loan = await Loan.findByIdAndUpdate(req.params.id, updateObject, {
    new: true
  });

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

module.exports = { fetchAll, create, update, delete: destroy, addPayment, deletePayment };

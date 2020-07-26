const response = require('../../helpers/response');

const { Loan } = require('../../models');

const { validate } = require('./service');

const fetchAll = async (req, res) => {
  try {
    const loans = await Loan.find();

    res.status(200).json(response.success({ loans }));
  } catch (error) {
    res.status(error.status || 500).json(response.error(error));
  }
};

const create = async (req, res) => {
  try {
    const memberId = req.body.memberId;
    const amount = req.body.amount;

    await validate({ memberId, amount });

    const loan = await Loan.create({ memberId, amount });

    res.status(201).json(response.success({ loan }));
  } catch (error) {
    res.status(error.status || 500).json(response.error(error));
  }
};

const update = async (req, res) => {
  try {
    const amount = req.body.amount;

    await validate({ amount }, req.params.id);

    const loan = await Loan.findByIdAndUpdate(req.params.id, { amount }, { new: true });

    res.status(200).json(response.success({ loan }));
  } catch (error) {
    res.status(error.status || 500).json(response.error(error));
  }
};

const destroy = async (req, res) => {
  try {
    const loan = await Loan.findOne({ _id: req.params.id });

    if (!loan) {
      let error = new Error('Loan not found');
      error.status = 404;
      throw error;
    }

    await Loan.deleteOne({ _id: req.params.id });

    res.status(200).json(response.success({ loanId: req.params.id }));
  } catch (error) {
    res.status(error.status || 500).json(response.error(error));
  }
};

module.exports = { fetchAll, create, update, delete: destroy };

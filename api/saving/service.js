const { Saving } = require('../../models');

const { isNumber } = require('../../helpers/utils');

const validatePresence = async id => {
  try {
    const existingSaving = await Saving.findOne({ _id: id }).lean();

    if (!existingSaving) {
      let error = new Error('Saving not found');
      error.status = 404;
      throw error;
    }

    return existingSaving;
  } catch (error) {
    throw error;
  }
};

const validate = async ({ memberId, amount, date, depositId }, id = null) => {
  try {
    if (!memberId) {
      let error = new Error('Please select member');
      error.status = 422;
      throw error;
    }

    if (amount <= 0 || !isNumber(amount)) {
      let error = new Error('Please enter correct amount');
      error.status = 422;
      throw error;
    }

    if (!date) {
      let error = new Error('Please select date');
      error.status = 422;
      throw error;
    }

    if (id && !depositId) {
      let error = new Error('Saving not found. Please try again');
      error.status = 422;
      throw error;
    }

    return true;
  } catch (error) {
    throw error;
  }
};

const validateDepositDelete = depositId => {
  try {
    if (!depositId) {
      let error = new Error('Deposit not found');
      error.status = 422;
      throw error;
    }

    return true;
  } catch (error) {
    throw error;
  }
};

const constructCreateObject = (memberId, amount, date, depositId, saving) => {
  try {
    saving.deposits.push({ depositId, amount, date });
    const totalSaving = saving.deposits.reduce((sum, d) => (sum += d.amount), 0);

    return { ...saving, totalSaving };
  } catch (error) {
    throw error;
  }
};

const constructUpdateObject = (memberId, amount, date, depositId, saving) => {
  try {
    let currentDeposit = saving.deposits.find(d => d.depositId === depositId);
    currentDeposit.amount = amount;
    currentDeposit.date = date;

    const totalSaving = saving.deposits.reduce((sum, d) => (sum += d.amount), 0);

    return { ...saving, totalSaving };
  } catch (error) {
    throw error;
  }
};

const constructDeleteDepositObject = (depositId, saving) => {
  try {
    saving.deposits = saving.deposits.filter(d => d.depositId !== depositId);

    const totalSaving = saving.deposits.reduce((sum, d) => (sum += d.amount), 0);

    return { ...saving, totalSaving };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  validatePresence,
  validate,
  validateDepositDelete,
  constructCreateObject,
  constructUpdateObject,
  constructDeleteDepositObject
};

const { Transaction, Account } = require('../../models');

const validatePresence = async (id) => {
  try {
    const existingTransaction = await Transaction.findOne({ _id: id }).lean();

    if (!existingTransaction) {
      let error = new Error('Transaction not found');
      error.status = 404;
      throw error;
    }

    return existingTransaction;
  } catch (error) {
    throw error;
  }
};

const validate = async (
  { amount = null, date = null, accountId = null, type = null, comment = null },
  loanId = null
) => {
  try {
    if (!amount) {
      let error = new Error('Transaction amount is required');
      error.status = 422;
      throw error;
    }

    if (!date) {
      let error = new Error('Transaction date is required');
      error.status = 422;
      throw error;
    }

    if (!type) {
      let error = new Error('Transaction type is required');
      error.status = 422;
      throw error;
    }

    if (!comment) {
      let error = new Error('Comment is required');
      error.status = 422;
      throw error;
    }

    if (loanId) {
      // update
      await validatePresence(loanId);
    } else {
      // create
      if (!accountId) {
        let error = new Error('Account is required');
        error.status = 422;
        throw error;
      }

      const account = await Account.findOne({ _id: accountId });
      if (!account) {
        let error = new Error('Account not found');
        error.status = 404;
        throw error;
      }
    }

    return true;
  } catch (error) {
    throw error;
  }
};

module.exports = { validatePresence, validate };

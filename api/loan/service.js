const { Member, Loan } = require('../../models');

const validate = async ({ memberId = null, amount = null }, loanId = null) => {
  try {
    if (!amount) {
      let error = new Error('Loan amount is required');
      error.status = 422;
      throw error;
    }

    if (loanId) {
      // update
      const loan = await Loan.findOne({ _id: loanId });
      if (!loan) {
        let error = new Error('Loan not found');
        error.status = 404;
        throw error;
      }
    } else {
      // create
      if (!memberId) {
        let error = new Error('Loan does not have member');
        error.status = 422;
        throw error;
      }

      const member = await Member.findOne({ _id: memberId });
      if (!member) {
        let error = new Error('Member not found');
        error.status = 404;
        throw error;
      }
    }

    return true;
  } catch (error) {
    throw error;
  }
};

module.exports = { validate };

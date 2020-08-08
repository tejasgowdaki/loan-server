const { Member, Loan } = require('../../models');

const validatePresence = async (id) => {
  try {
    const existingLoan = await Loan.findOne({ _id: id }).lean();

    if (!existingLoan) {
      let error = new Error('Loan not found');
      error.status = 404;
      throw error;
    }

    return existingLoan;
  } catch (error) {
    throw error;
  }
};

const validate = async ({ memberId = null, amount = null, date = null }, loanId = null) => {
  try {
    if (!amount) {
      let error = new Error('Loan amount is required');
      error.status = 422;
      throw error;
    }

    if (!date) {
      let error = new Error('Loan date is required');
      error.status = 422;
      throw error;
    }

    if (loanId) {
      // update
      await validatePresence(loanId);
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

const validatePayment = async ({ amount = null, date = null }, loan) => {
  try {
    if (!amount) {
      let error = new Error('Payment amount is required');
      error.status = 422;
      throw error;
    }

    if (!date) {
      let error = new Error('Loan date is required');
      error.status = 422;
      throw error;
    }

    if (loan.paidAmount + amount > loan.amount) {
      let error = new Error('Payment amount exceeds loan amount');
      error.status = 422;
      throw error;
    }

    return true;
  } catch (error) {
    throw error;
  }
};

const validatePaymentDelete = (paymentId) => {
  try {
    if (!paymentId) {
      let error = new Error('Loan payment not found');
      error.status = 422;
      throw error;
    }

    return true;
  } catch (error) {
    throw error;
  }
};

const constructCreatePaymentObject = (amount, interest, date, loan) => {
  try {
    loan.payments.push({ amount, interest, date });
    const paidAmount = loan.payments.reduce((sum, p) => (sum += p.amount), 0);
    const paidInterest = loan.payments.reduce((sum, p) => (sum += p.interest), 0);

    return { ...loan, paidAmount, paidInterest };
  } catch (error) {
    throw error;
  }
};

const constructDeletePaymentObject = (paymentId, loan) => {
  try {
    loan.payments = loan.payments.filter((p) => p._id.toString() !== paymentId.toString());
    const paidAmount = loan.payments.reduce((sum, p) => (sum += p.amount), 0);
    const paidInterest = loan.payments.reduce((sum, p) => (sum += p.interest), 0);

    return { ...loan, paidAmount, paidInterest };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  validatePresence,
  validate,
  validatePayment,
  validatePaymentDelete,
  constructCreatePaymentObject,
  constructDeletePaymentObject
};

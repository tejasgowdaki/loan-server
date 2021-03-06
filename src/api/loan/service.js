const { Member, Loan, Account } = require('../../models');

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

const validate = async ({ memberId = null, amount = null, date = null, accountId = null }, loanId = null) => {
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

const validatePayment = async ({ amount, interest, date }, loan) => {
  try {
    if (!amount && !interest) {
      let error = new Error('Payment amount or interest is required');
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

const constructCreateSubLoanObject = (amount, date) => {
  try {
    return { amount, subLoans: [{ amount, date }] };
  } catch (error) {
    throw error;
  }
};

const constructUpdateSubLoanObject = (subLoanId, amount, date, loan) => {
  try {
    if (subLoanId) {
      const subLoan = loan.subLoans.find((l) => l._id.toString() === subLoanId.toString());
      subLoan.amount = amount;
      subLoan.date = date;
    } else {
      loan.subLoans.push({ amount, date });
    }

    const totalAmount = loan.subLoans.reduce((sum, p) => (sum += p.amount), 0);

    if (totalAmount < loan.paidAmount) {
      let error = new Error('Loan paid amount cannot be greater than loan amount');
      error.status = 422;
      throw error;
    }

    loan.amount = totalAmount;
    loan.isCompleted = loan.paidAmount >= totalAmount ? true : false;

    return { ...loan };
  } catch (error) {
    throw error;
  }
};

const constructDeleteSubLoanObject = (subLoanId, loan) => {
  try {
    loan.subLoans = loan.subLoans.filter((s) => s._id.toString() !== subLoanId.toString());
    const totalAmount = loan.subLoans.reduce((sum, p) => (sum += p.amount), 0);

    if (totalAmount < loan.paidAmount) {
      let error = new Error('Loan paid amount cannot be greater than loan amount');
      error.status = 422;
      throw error;
    }

    loan.amount = totalAmount;
    loan.isCompleted = loan.paidAmount >= totalAmount ? true : false;

    return { ...loan };
  } catch (error) {
    throw error;
  }
};

const constructCreatePaymentObject = (amount, interest, date, loan) => {
  try {
    loan.payments.push({ amount, interest, date });
    const paidAmount = loan.payments.reduce((sum, p) => (sum += p.amount), 0);
    const paidInterest = loan.payments.reduce((sum, p) => (sum += p.interest), 0);

    loan.isCompleted = paidAmount >= loan.amount ? true : false;

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

    loan.isCompleted = paidAmount >= loan.amount ? true : false;

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
  constructCreateSubLoanObject,
  constructUpdateSubLoanObject,
  constructDeleteSubLoanObject,
  constructCreatePaymentObject,
  constructDeletePaymentObject
};

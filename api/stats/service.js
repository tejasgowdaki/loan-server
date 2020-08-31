const { Member, Saving, Loan } = require('../../models');

const fetchMembersCount = async (accountId) => {
  try {
    return await Member.find({ accountId }).countDocuments();
  } catch (error) {
    throw error;
  }
};

const fetchTotalSavings = async (accountId) => {
  try {
    const savings = await Saving.find({ accountId });
    return savings.reduce((sum, saving) => (sum += saving.totalSaving), 0);
  } catch (error) {
    throw error;
  }
};

const fetchLoanStats = async (accountId) => {
  try {
    const loans = await Loan.find({ accountId });
    const amount = loans.reduce((sum, loan) => (sum += loan.amount), 0);
    const paidAmount = loans.reduce((sum, loan) => (sum += loan.paidAmount), 0);
    const paidInterest = loans.reduce((sum, loan) => (sum += loan.paidInterest), 0);

    return { amount, paidAmount, paidInterest };
  } catch (error) {
    throw error;
  }
};

module.exports = { fetchMembersCount, fetchTotalSavings, fetchLoanStats };

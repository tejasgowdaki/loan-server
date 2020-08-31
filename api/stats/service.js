const { Member, Saving, Loan, Transaction } = require('../../models');

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

const fetchTransactionStats = async (accountId) => {
  try {
    const transactions = await Transaction.find({ accountId });
    return transactions.reduce(
      (data, transaction) => {
        if (transaction.type === 'income') {
          data.income += transaction.amount;
        } else if (transaction.type === 'expense') {
          data.expense += transaction.amount;
        }

        return data;
      },
      { income: 0, expense: 0 }
    );
  } catch (error) {
    throw error;
  }
};

module.exports = { fetchMembersCount, fetchTotalSavings, fetchLoanStats, fetchTransactionStats };

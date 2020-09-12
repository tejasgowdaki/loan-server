const response = require('../../helpers/response');

const { Account } = require('../../models');

const {
  fetchMembersCount,
  fetchTotalSavings,
  fetchLoanStats,
  fetchTransactionStats,
  fetchMonthlySavings,
  fetchMonthlyLoan,
  fetchMonthlyTransaction
} = require('./service');

const fetchStats = async (req, res) => {
  const account = await Account.findOne({ _id: req.account._id });

  if (!account) {
    let error = new Error('Account not found');
    error.status = 404;
    throw error;
  }

  const [members, savings, loan, transaction, monthlySavings, monthlyLoan, monthlyTransaction] = await Promise.all([
    fetchMembersCount(account._id),
    fetchTotalSavings(account._id),
    fetchLoanStats(account._id),
    fetchTransactionStats(account._id),
    fetchMonthlySavings(account._id),
    fetchMonthlyLoan(account._id),
    fetchMonthlyTransaction(account._id)
  ]);

  res
    .status(200)
    .json(response.success({ members, savings, loan, transaction, monthlySavings, monthlyLoan, monthlyTransaction }));
};

module.exports = { fetchStats };

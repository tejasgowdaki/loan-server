const moment = require('moment');

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
  const { month = null, isOnlyMonth = false } = req.query;

  const account = await Account.findOne({ _id: req.account._id });

  if (!account) {
    let error = new Error('Account not found');
    error.status = 404;
    throw error;
  }

  const startDate = month ? moment(month, 'YYYY-MM').startOf('month').toDate() : moment().startOf('month').toDate();
  const endDate = month ? moment(month, 'YYYY-MM').endOf('month').toDate() : moment().endOf('month').toDate();

  if (isOnlyMonth === 'true') {
    const [monthlySavings, monthlyLoan, monthlyTransaction] = await Promise.all([
      fetchMonthlySavings(account._id, startDate, endDate),
      fetchMonthlyLoan(account._id, startDate, endDate),
      fetchMonthlyTransaction(account._id, startDate, endDate)
    ]);

    res.status(200).json(response.success({ monthlySavings, monthlyLoan, monthlyTransaction }));
    return;
  }

  const [members, savings, loan, transaction, monthlySavings, monthlyLoan, monthlyTransaction] = await Promise.all([
    fetchMembersCount(account._id),
    fetchTotalSavings(account._id),
    fetchLoanStats(account._id),
    fetchTransactionStats(account._id),
    fetchMonthlySavings(account._id, startDate, endDate),
    fetchMonthlyLoan(account._id, startDate, endDate),
    fetchMonthlyTransaction(account._id, startDate, endDate)
  ]);

  res
    .status(200)
    .json(response.success({ members, savings, loan, transaction, monthlySavings, monthlyLoan, monthlyTransaction }));
};

module.exports = { fetchStats };

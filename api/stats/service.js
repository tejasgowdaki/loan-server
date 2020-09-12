const moment = require('moment');

const { Member, Saving, Loan, Transaction } = require('../../models');

const monthlySavingAggregationQuery = (accountId, date) => [
  { $match: { accountId } },
  { $unwind: '$deposits' },
  { $group: { _id: null, deposits: { $push: '$deposits' } } },
  {
    $project: {
      _id: 0,
      deposits: { $filter: { input: '$deposits', as: 'deposit', cond: { $gte: ['$$deposit.date', date] } } }
    }
  }
];

const monthlyLoanAggregationQuery = (accountId, date) => {
  try {
    const query = [
      { $match: { accountId } },
      {
        $facet: {
          loans: [
            { $unwind: '$subLoans' },
            { $group: { _id: null, loans: { $push: '$subLoans' } } },
            {
              $project: {
                _id: 0,
                loans: { $filter: { input: '$loans', as: 'loan', cond: { $gte: ['$$loan.date', date] } } }
              }
            }
          ],
          payments: [
            { $unwind: '$payments' },
            { $group: { _id: null, payments: { $push: '$payments' } } },
            {
              $project: {
                _id: 0,
                payments: { $filter: { input: '$payments', as: 'payment', cond: { $gte: ['$$payment.date', date] } } }
              }
            }
          ]
        }
      }
    ];

    return query;
  } catch (error) {
    throw error;
  }
};

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

const fetchMonthlySavings = async (accountId) => {
  try {
    const date = moment().startOf('month').toDate();
    const result = await Saving.aggregate(monthlySavingAggregationQuery(accountId, date));
    const savings = result[0] ? (result[0] || {}).deposits || [] : [];
    return savings.reduce((sum, saving) => (sum += saving.amount), 0);
  } catch (error) {
    throw error;
  }
};

const fetchMonthlyLoan = async (accountId) => {
  try {
    const date = moment().startOf('month').toDate();
    const result = await Loan.aggregate(monthlyLoanAggregationQuery(accountId, date));
    const loans =
      result[0] && result[0].loans && result[0].loans[0] && result[0].loans[0].loans ? result[0].loans[0].loans : [];
    const payments =
      result[0] && result[0].payments && result[0].payments[0] && result[0].payments[0].payments
        ? result[0].payments[0].payments
        : [];

    const amount = loans.reduce((sum, loan) => (sum += loan.amount), 0);
    const paidAmount = payments.reduce((sum, payment) => (sum += payment.amount), 0);
    const paidInterest = payments.reduce((sum, payment) => (sum += payment.interest), 0);

    return { amount, paidAmount, paidInterest };
  } catch (error) {
    throw error;
  }
};

const fetchMonthlyTransaction = async (accountId) => {
  try {
    const date = moment().startOf('month').toDate();

    const transactions = await Transaction.find({ accountId, date: { $gte: date } });

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

module.exports = {
  fetchMembersCount,
  fetchTotalSavings,
  fetchLoanStats,
  fetchTransactionStats,
  fetchMonthlySavings,
  fetchMonthlyLoan,
  fetchMonthlyTransaction
};

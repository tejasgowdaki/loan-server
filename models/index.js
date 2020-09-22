const mongoDb = require('../config/mongoDb');

const UserSchema = require('../models/user');
const AccountSchema = require('../models/account');
const MemberSchema = require('../models/member');
const SavingSchema = require('../models/saving');
const LoanSchema = require('../models/loan');
const TransactionSchema = require('../models/transaction');
const ChitSchema = require('../models/chit');

const User = UserSchema(mongoDb);
const Account = AccountSchema(mongoDb);
const Member = MemberSchema(mongoDb);
const Saving = SavingSchema(mongoDb);
const Loan = LoanSchema(mongoDb);
const Transaction = TransactionSchema(mongoDb);
const Chit = ChitSchema(mongoDb);

module.exports = { User, Account, Member, Saving, Loan, Transaction, Chit };

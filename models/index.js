const mongoDb = require('../config/mongoDb');

const AccountSchema = require('../models/account');
const MemberSchema = require('../models/member');
const SavingSchema = require('../models/saving');
const LoanSchema = require('../models/loan');

const Account = AccountSchema(mongoDb);
const Member = MemberSchema(mongoDb);
const Saving = SavingSchema(mongoDb);
const Loan = LoanSchema(mongoDb);

module.exports = { Account, Member, Saving, Loan };

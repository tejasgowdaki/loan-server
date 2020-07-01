const mongoDb = require("../config/mongoDb");

const MemberSchema = require("../models/member");
const SavingSchema = require("../models/saving");
const LoanSchema = require("../models/loan");

const Member = MemberSchema(mongoDb);
const Saving = SavingSchema(mongoDb);
const Loan = LoanSchema(mongoDb);

module.exports = { Member, Saving, Loan };

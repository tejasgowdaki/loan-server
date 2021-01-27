const Schema = require('mongoose').Schema;

const PaymentSchema = new Schema({
  amount: {
    type: Number,
    default: 0
  },
  interest: {
    type: Number,
    default: 0
  },
  date: {
    type: Date,
    required: true,
    default: new Date()
  }
});

const SubLoansSchema = new Schema({
  amount: {
    type: Number,
    default: 0,
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: new Date()
  }
});

const LoanSchema = new Schema(
  {
    memberId: {
      type: Schema.Types.ObjectId,
      ref: 'Member',
      required: true
    },
    accountId: {
      type: Schema.Types.ObjectId,
      ref: 'Account',
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    paidAmount: {
      type: Number,
      required: true,
      default: 0
    },
    paidInterest: {
      type: Number,
      required: true,
      default: 0
    },
    subLoans: {
      type: [SubLoansSchema],
      default: []
    },
    payments: {
      type: [PaymentSchema],
      default: []
    },
    isCompleted: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = (mongooseConnection) => mongooseConnection.model('Loan', LoanSchema);

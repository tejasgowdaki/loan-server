const Schema = require('mongoose').Schema;

const PaymentSchema = new Schema({
  amount: {
    type: Number,
    required: true
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

const LoanSchema = new Schema(
  {
    memberId: {
      type: Schema.Types.ObjectId,
      ref: 'Member',
      required: true
    },
    date: {
      type: Date,
      required: true,
      default: new Date()
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
    payments: {
      type: [PaymentSchema],
      default: []
    }
  },
  {
    timestamps: true
  }
);

module.exports = (mongooseConnection) => mongooseConnection.model('Loan', LoanSchema);

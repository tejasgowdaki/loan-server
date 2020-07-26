const Schema = require('mongoose').Schema;

const PaymentSchema = new Schema({
  loanAmount: {
    type: Number,
    required: true
  },
  interestAmount: {
    type: Number,
    default: 0
  },
  totalAmount: {
    type: Number,
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
    amount: {
      type: Number,
      required: true
    },
    paidAmount: {
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

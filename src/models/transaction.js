const Schema = require('mongoose').Schema;

const TransactionSchema = new Schema(
  {
    accountId: {
      type: Schema.Types.ObjectId,
      ref: 'Account',
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
    type: {
      type: String,
      enum: ['income', 'expense'],
      required: true
    },
    comment: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = (mongooseConnection) => mongooseConnection.model('Transaction', TransactionSchema);

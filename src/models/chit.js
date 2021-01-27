const Schema = require('mongoose').Schema;

const ChitSchema = new Schema(
  {
    accountId: {
      type: Schema.Types.ObjectId,
      ref: 'Account',
      required: true
    },
    amount: {
      type: Number,
      required: true,
      default: 0
    },
    date: {
      type: Date,
      required: true,
      default: new Date()
    },
    receiver: {
      type: String,
      enum: ['agent', 'member'],
      required: true
    },
    memberId: {
      type: Schema.Types.ObjectId,
      ref: 'Member'
    }
  },
  {
    timestamps: true
  }
);

module.exports = (mongooseConnection) => mongooseConnection.model('Chit', ChitSchema);

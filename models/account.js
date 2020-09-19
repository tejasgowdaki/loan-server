const Schema = require('mongoose').Schema;

const AccountSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    type: {
      type: String,
      enum: ['loan', 'chit'],
      required: true
    },
    startDate: {
      type: Date
    },
    config: {
      isSmsEnabled: {
        type: Boolean,
        default: false
      },
      interestRate: {
        type: Number,
        default: 0
      },
      isShowNextInterest: {
        type: Boolean,
        default: false
      }
    }
  },
  {
    timestamps: true
  }
);

module.exports = (mongooseConnection) => mongooseConnection.model('Account', AccountSchema);

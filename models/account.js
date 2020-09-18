const Schema = require('mongoose').Schema;

const AccountSchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    config: {
      isSmsEnabled: {
        type: Boolean,
        default: false
      },
      interestRate: {
        type: Number,
        default: 1
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

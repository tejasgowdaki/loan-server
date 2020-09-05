const Schema = require('mongoose').Schema;

const AccountSchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true
    },
    mobile: {
      type: String,
      required: true
    },
    otp: {
      type: String
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    config: {
      isSmsEnabled: {
        type: Boolean,
        default: false
      },
      interestRate: {
        type: Number,
        default: 1
      }
    }
  },
  {
    timestamps: true
  }
);

module.exports = (mongooseConnection) => mongooseConnection.model('Account', AccountSchema);

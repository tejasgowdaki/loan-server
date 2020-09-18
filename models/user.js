const Schema = require('mongoose').Schema;

const UserSchema = new Schema(
  {
    mobile: {
      type: String,
      required: true,
      unique: true
    },
    otp: {
      type: String
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    activeAccountId: {
      type: Schema.Types.ObjectId,
      ref: 'Account'
    }
  },
  {
    timestamps: true
  }
);

module.exports = (mongooseConnection) => mongooseConnection.model('User', UserSchema);

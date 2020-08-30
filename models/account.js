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
      required: true,
      unique: true
    },
    otp: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

module.exports = (mongooseConnection) => mongooseConnection.model('Account', AccountSchema);
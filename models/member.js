const Schema = require('mongoose').Schema;

const MemberSchema = new Schema(
  {
    name: {
      type: String,
      unique: true
    },
    mobile: {
      type: String,
      required: true
    },
    accountId: {
      type: Schema.Types.ObjectId,
      ref: 'Account',
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = (mongooseConnection) => mongooseConnection.model('Member', MemberSchema);

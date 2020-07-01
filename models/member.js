const Schema = require("mongoose").Schema;

const MemberSchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true
    },
    mobile: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongooseConnection =>
  mongooseConnection.model("Member", MemberSchema);

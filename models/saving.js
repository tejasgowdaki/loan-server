const Schema = require("mongoose").Schema;

const DepositSchema = new Schema(
  {
    depositId: {
      type: String,
      unique: true,
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    date: {
      type: Date,
      required: true,
      default: new Date()
    }
  },
);

const SavingSchema = new Schema(
  {
    memberId: {
      type: Schema.Types.ObjectId,
      ref: "Member",
      required: true
    },
    totalSaving: {
      type: Number,
      default: 0
    },
    deposits: {
      type: [DepositSchema],
      default: []
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongooseConnection =>
  mongooseConnection.model("Saving", SavingSchema);

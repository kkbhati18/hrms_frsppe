const mongoose = require("mongoose");

const expenseClaimTypeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: String,
    accounts: [
      {
        company: String,
        defaultAccount: String,
      },
    ],
    disabled: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ExpenseClaimType", expenseClaimTypeSchema);

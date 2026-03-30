const mongoose = require("mongoose");

const salaryComponentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    abbr: { type: String, required: true, trim: true },
    type: { type: String, enum: ["Earning", "Deduction"], required: true },
    description: String,
    isPayable: { type: Boolean, default: true },
    isTaxApplicable: { type: Boolean, default: false },
    isFlexiBenefit: { type: Boolean, default: false },
    dependsOnPaymentDays: { type: Boolean, default: true },
    roundToTheNearestInteger: { type: Boolean, default: false },
    statistical: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    formula: String, // Python-like formula (stored for reference)
    condition: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("SalaryComponent", salaryComponentSchema);

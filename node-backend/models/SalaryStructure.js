const mongoose = require("mongoose");

const salaryDetailSchema = new mongoose.Schema(
  {
    salaryComponent: { type: mongoose.Schema.Types.ObjectId, ref: "SalaryComponent", required: true },
    abbr: String,
    amount: { type: Number, default: 0 },
    defaultAmount: Number,
    formula: String,
    condition: String,
    dependsOnPaymentDays: { type: Boolean, default: true },
  },
  { _id: false }
);

const salaryStructureSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    company: { type: String, trim: true },
    currency: { type: String, default: "INR" },
    payrollFrequency: {
      type: String,
      enum: ["Monthly", "Quarterly", "Biannually", "Annually", ""],
      default: "Monthly",
    },
    isActive: { type: Boolean, default: true },
    earnings: [salaryDetailSchema],
    deductions: [salaryDetailSchema],
    description: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("SalaryStructure", salaryStructureSchema);

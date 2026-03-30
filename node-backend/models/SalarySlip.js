const mongoose = require("mongoose");

const slipDetailSchema = new mongoose.Schema(
  {
    salaryComponent: { type: mongoose.Schema.Types.ObjectId, ref: "SalaryComponent" },
    abbr: String,
    amount: { type: Number, default: 0 },
    ytdAmount: { type: Number, default: 0 },
    defaultAmount: Number,
    additionalAmount: { type: Number, default: 0 },
    isAdditionalComponent: { type: Boolean, default: false },
  },
  { _id: false }
);

const salarySlipSchema = new mongoose.Schema(
  {
    employee: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
    employeeName: String,
    salaryStructure: { type: mongoose.Schema.Types.ObjectId, ref: "SalaryStructure" },
    payrollEntry: { type: mongoose.Schema.Types.ObjectId, ref: "PayrollEntry" },
    company: { type: String, trim: true },
    currency: { type: String, default: "INR" },
    department: { type: mongoose.Schema.Types.ObjectId, ref: "Department" },
    designation: { type: mongoose.Schema.Types.ObjectId, ref: "Designation" },

    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    paymentDays: { type: Number, default: 0 },
    leavesWithoutPay: { type: Number, default: 0 },
    absentDays: { type: Number, default: 0 },

    earnings: [slipDetailSchema],
    deductions: [slipDetailSchema],

    grossPay: { type: Number, default: 0 },
    totalDeductions: { type: Number, default: 0 },
    netPay: { type: Number, default: 0 },
    roundedTotal: { type: Number, default: 0 },

    status: { type: String, enum: ["Draft", "Submitted", "Cancelled"], default: "Draft" },
    docStatus: { type: Number, enum: [0, 1, 2], default: 0 },

    bankAccountNo: String,
    modeOfPayment: { type: String, enum: ["Bank Transfer", "Cash", "Cheque"], default: "Bank Transfer" },

    amendedFrom: { type: mongoose.Schema.Types.ObjectId, ref: "SalarySlip" },
  },
  { timestamps: true }
);

salarySlipSchema.index({ employee: 1, startDate: 1, endDate: 1 });

module.exports = mongoose.model("SalarySlip", salarySlipSchema);

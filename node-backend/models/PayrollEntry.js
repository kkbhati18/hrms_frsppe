const mongoose = require("mongoose");

const payrollEmployeeDetailSchema = new mongoose.Schema(
  {
    employee: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
    employeeName: String,
    salarySlip: { type: mongoose.Schema.Types.ObjectId, ref: "SalarySlip" },
    department: String,
    designation: String,
    netPay: Number,
    status: { type: String, enum: ["Created", "Not Created", "Queued"], default: "Not Created" },
  },
  { _id: false }
);

const payrollEntrySchema = new mongoose.Schema(
  {
    company: { type: String, required: true, trim: true },
    payrollFrequency: {
      type: String,
      enum: ["Monthly", "Quarterly", "Biannually", "Annually"],
      default: "Monthly",
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    department: { type: mongoose.Schema.Types.ObjectId, ref: "Department" },
    branch: String,
    designation: { type: mongoose.Schema.Types.ObjectId, ref: "Designation" },
    currency: { type: String, default: "INR" },
    employees: [payrollEmployeeDetailSchema],
    salarySlipsCreated: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["Draft", "Submitted", "Cancelled"],
      default: "Draft",
    },
    docStatus: { type: Number, enum: [0, 1, 2], default: 0 },
    costCenter: String,
    project: String,
    paymentAccount: String,
    bankAccount: String,
    paymentDate: Date,
  },
  { timestamps: true }
);

payrollEntrySchema.index({ company: 1, startDate: 1, endDate: 1 });

module.exports = mongoose.model("PayrollEntry", payrollEntrySchema);

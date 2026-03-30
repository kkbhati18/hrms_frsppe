const mongoose = require("mongoose");

const expenseTaxSchema = new mongoose.Schema(
  {
    accountHead: String,
    taxAmount: Number,
    description: String,
    rate: Number,
  },
  { _id: false }
);

const expenseDetailSchema = new mongoose.Schema(
  {
    expenseType: { type: mongoose.Schema.Types.ObjectId, ref: "ExpenseClaimType" },
    defaultAccount: String,
    description: String,
    sanctionedAmount: { type: Number, default: 0 },
    claimAmount: { type: Number, required: true, min: 0 },
    amount: Number,
    attachments: [String],
    taxWithholdingCategory: String,
  },
  { _id: false }
);

const expenseClaimSchema = new mongoose.Schema(
  {
    employee: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
    employeeName: String,
    company: { type: String, trim: true },
    approver: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
    postingDate: { type: Date, default: Date.now },
    expenseApprover: { type: String, trim: true },
    expenses: [expenseDetailSchema],
    taxesAndCharges: [expenseTaxSchema],

    totalClaimedAmount: { type: Number, default: 0 },
    totalSanctionedAmount: { type: Number, default: 0 },
    grandTotal: { type: Number, default: 0 },
    totalAdvanceAmount: { type: Number, default: 0 },
    outstandingAmount: { type: Number, default: 0 },

    status: {
      type: String,
      enum: ["Draft", "Submitted", "Approved", "Rejected", "Paid", "Cancelled"],
      default: "Draft",
    },
    approvalStatus: {
      type: String,
      enum: ["Draft", "Approved", "Rejected"],
      default: "Draft",
    },
    rejectionReason: String,
    paymentMode: { type: String, enum: ["Reimbursement", "Company Expense", ""], default: "" },
    bankAccountNo: String,
    remarks: String,
  },
  { timestamps: true }
);

expenseClaimSchema.index({ employee: 1, status: 1 });

module.exports = mongoose.model("ExpenseClaim", expenseClaimSchema);

import mongoose, { Document, Schema } from "mongoose";

export interface IExpenseDetail {
  expenseDate?: Date;
  expenseType?: mongoose.Types.ObjectId;
  description?: string;
  claimAmount?: number;
  sanctionedAmount?: number;
}

export interface IExpenseTax {
  accountHead?: string;
  rate?: number;
  amount?: number;
}

export interface IExpenseClaim extends Document {
  employee: mongoose.Types.ObjectId;
  company?: string;
  postingDate?: Date;
  expenses?: IExpenseDetail[];
  taxes?: IExpenseTax[];
  totalClaimedAmount?: number;
  totalSanctionedAmount?: number;
  approvalStatus?: string;
  status?: string;
  approver?: mongoose.Types.ObjectId;
  rejectionReason?: string;
  paymentMode?: string;
  clearanceDate?: Date;
  docStatus?: number;
}

const expenseDetailSchema = new Schema<IExpenseDetail>(
  {
    expenseDate: Date,
    expenseType: { type: Schema.Types.ObjectId, ref: "ExpenseClaimType" },
    description: String,
    claimAmount: { type: Number, default: 0 },
    sanctionedAmount: { type: Number, default: 0 },
  },
  { _id: false }
);

const expenseTaxSchema = new Schema<IExpenseTax>(
  {
    accountHead: String,
    rate: { type: Number, default: 0 },
    amount: { type: Number, default: 0 },
  },
  { _id: false }
);

const expenseClaimSchema = new Schema<IExpenseClaim>(
  {
    employee: { type: Schema.Types.ObjectId, ref: "Employee", required: true },
    company: String,
    postingDate: Date,
    expenses: [expenseDetailSchema],
    taxes: [expenseTaxSchema],
    totalClaimedAmount: { type: Number, default: 0 },
    totalSanctionedAmount: { type: Number, default: 0 },
    approvalStatus: {
      type: String,
      enum: ["Draft", "Approved", "Rejected"],
      default: "Draft",
    },
    status: {
      type: String,
      enum: ["Draft", "Submitted", "Paid", "Rejected", "Cancelled"],
      default: "Draft",
    },
    approver: { type: Schema.Types.ObjectId, ref: "Employee" },
    rejectionReason: String,
    paymentMode: { type: String, enum: ["Cash", "Bank Transfer", ""], default: "" },
    clearanceDate: Date,
    docStatus: { type: Number, enum: [0, 1, 2], default: 0 },
  },
  { timestamps: true }
);

expenseClaimSchema.index({ employee: 1, status: 1 });

export default mongoose.model<IExpenseClaim>("ExpenseClaim", expenseClaimSchema);

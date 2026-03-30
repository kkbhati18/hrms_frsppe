import mongoose, { Document, Schema } from "mongoose";

export interface ISlipDetail {
  salaryComponent?: mongoose.Types.ObjectId;
  abbr?: string;
  amount?: number;
}

export interface ISalarySlip extends Document {
  employee: mongoose.Types.ObjectId;
  salaryStructure?: mongoose.Types.ObjectId;
  payrollEntry?: mongoose.Types.ObjectId;
  department?: mongoose.Types.ObjectId;
  designation?: mongoose.Types.ObjectId;
  company?: string;
  startDate: Date;
  endDate: Date;
  postingDate?: Date;
  paymentDays?: number;
  leavesWithoutPay?: number;
  absentDays?: number;
  earnings?: ISlipDetail[];
  deductions?: ISlipDetail[];
  grossPay?: number;
  totalDeductions?: number;
  netPay?: number;
  currency?: string;
  status?: string;
  docStatus?: number;
}

const slipDetailSchema = new Schema<ISlipDetail>(
  {
    salaryComponent: { type: Schema.Types.ObjectId, ref: "SalaryComponent" },
    abbr: String,
    amount: { type: Number, default: 0 },
  },
  { _id: false }
);

const salarySlipSchema = new Schema<ISalarySlip>(
  {
    employee: { type: Schema.Types.ObjectId, ref: "Employee", required: true },
    salaryStructure: { type: Schema.Types.ObjectId, ref: "SalaryStructure" },
    payrollEntry: { type: Schema.Types.ObjectId, ref: "PayrollEntry" },
    department: { type: Schema.Types.ObjectId, ref: "Department" },
    designation: { type: Schema.Types.ObjectId, ref: "Designation" },
    company: String,
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    postingDate: Date,
    paymentDays: { type: Number, default: 0 },
    leavesWithoutPay: { type: Number, default: 0 },
    absentDays: { type: Number, default: 0 },
    earnings: [slipDetailSchema],
    deductions: [slipDetailSchema],
    grossPay: { type: Number, default: 0 },
    totalDeductions: { type: Number, default: 0 },
    netPay: { type: Number, default: 0 },
    currency: { type: String, default: "INR" },
    status: { type: String, enum: ["Draft", "Submitted", "Cancelled"], default: "Draft" },
    docStatus: { type: Number, enum: [0, 1, 2], default: 0 },
  },
  { timestamps: true }
);

salarySlipSchema.index({ employee: 1, startDate: -1 });

export default mongoose.model<ISalarySlip>("SalarySlip", salarySlipSchema);

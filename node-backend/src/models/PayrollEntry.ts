import mongoose, { Document, Schema } from "mongoose";

export interface IPayrollEmployeeDetail {
  employee?: mongoose.Types.ObjectId;
  salarySlip?: mongoose.Types.ObjectId;
  workingDays?: number;
  absentDays?: number;
  netPay?: number;
}

export interface IPayrollEntry extends Document {
  company: string;
  startDate: Date;
  endDate: Date;
  postingDate?: Date;
  payrollFrequency?: string;
  branch?: string;
  department?: mongoose.Types.ObjectId;
  designation?: mongoose.Types.ObjectId;
  currency?: string;
  employees?: IPayrollEmployeeDetail[];
  totalGrossPay?: number;
  totalDeductions?: number;
  totalNetPay?: number;
  status?: string;
  docStatus?: number;
}

const payrollEmployeeDetailSchema = new Schema<IPayrollEmployeeDetail>(
  {
    employee: { type: Schema.Types.ObjectId, ref: "Employee" },
    salarySlip: { type: Schema.Types.ObjectId, ref: "SalarySlip" },
    workingDays: { type: Number, default: 0 },
    absentDays: { type: Number, default: 0 },
    netPay: { type: Number, default: 0 },
  },
  { _id: false }
);

const payrollEntrySchema = new Schema<IPayrollEntry>(
  {
    company: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    postingDate: Date,
    payrollFrequency: {
      type: String,
      enum: ["Monthly", "Bimonthly", "Fortnightly", "Weekly", "Daily", ""],
      default: "Monthly",
    },
    branch: String,
    department: { type: Schema.Types.ObjectId, ref: "Department" },
    designation: { type: Schema.Types.ObjectId, ref: "Designation" },
    currency: { type: String, default: "INR" },
    employees: [payrollEmployeeDetailSchema],
    totalGrossPay: { type: Number, default: 0 },
    totalDeductions: { type: Number, default: 0 },
    totalNetPay: { type: Number, default: 0 },
    status: { type: String, enum: ["Draft", "Submitted", "Cancelled"], default: "Draft" },
    docStatus: { type: Number, enum: [0, 1, 2], default: 0 },
  },
  { timestamps: true }
);

payrollEntrySchema.index({ company: 1, startDate: 1, endDate: 1 });

export default mongoose.model<IPayrollEntry>("PayrollEntry", payrollEntrySchema);

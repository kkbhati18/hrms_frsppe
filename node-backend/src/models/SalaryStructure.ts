import mongoose, { Document, Schema } from "mongoose";

export interface ISalaryDetail {
  salaryComponent?: mongoose.Types.ObjectId;
  amount?: number;
  formula?: string;
  condition?: string;
}

export interface ISalaryStructure extends Document {
  name: string;
  company?: string;
  currency?: string;
  earnings?: ISalaryDetail[];
  deductions?: ISalaryDetail[];
  isActive?: boolean;
  isDefault?: boolean;
  description?: string;
}

const salaryDetailSchema = new Schema<ISalaryDetail>(
  {
    salaryComponent: { type: Schema.Types.ObjectId, ref: "SalaryComponent" },
    amount: { type: Number, default: 0 },
    formula: String,
    condition: String,
  },
  { _id: false }
);

const salaryStructureSchema = new Schema<ISalaryStructure>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    company: String,
    currency: { type: String, default: "INR" },
    earnings: [salaryDetailSchema],
    deductions: [salaryDetailSchema],
    isActive: { type: Boolean, default: true },
    isDefault: { type: Boolean, default: false },
    description: String,
  },
  { timestamps: true }
);

export default mongoose.model<ISalaryStructure>("SalaryStructure", salaryStructureSchema);

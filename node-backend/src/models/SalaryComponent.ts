import mongoose, { Document, Schema } from "mongoose";

export interface ISalaryComponent extends Document {
  name: string;
  abbr: string;
  type: string;
  formula?: string;
  condition?: string;
  isStatutoryComponent?: boolean;
  isFlexibleBenefit?: boolean;
  disabled?: boolean;
  description?: string;
}

const salaryComponentSchema = new Schema<ISalaryComponent>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    abbr: { type: String, required: true, trim: true },
    type: { type: String, enum: ["Earning", "Deduction"], required: true },
    formula: String,
    condition: String,
    isStatutoryComponent: { type: Boolean, default: false },
    isFlexibleBenefit: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    description: String,
  },
  { timestamps: true }
);

export default mongoose.model<ISalaryComponent>("SalaryComponent", salaryComponentSchema);

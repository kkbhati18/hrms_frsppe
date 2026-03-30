import mongoose, { Document, Schema } from "mongoose";

export interface ISalaryStructureAssignment extends Document {
  employee: mongoose.Types.ObjectId;
  salaryStructure: mongoose.Types.ObjectId;
  fromDate: Date;
  base: number;
  company?: string;
  currency?: string;
  docStatus?: number;
}

const salaryStructureAssignmentSchema = new Schema<ISalaryStructureAssignment>(
  {
    employee: { type: Schema.Types.ObjectId, ref: "Employee", required: true },
    salaryStructure: { type: Schema.Types.ObjectId, ref: "SalaryStructure", required: true },
    fromDate: { type: Date, required: true },
    base: { type: Number, required: true },
    company: String,
    currency: { type: String, default: "INR" },
    docStatus: { type: Number, enum: [0, 1, 2], default: 0 },
  },
  { timestamps: true }
);

salaryStructureAssignmentSchema.index({ employee: 1, fromDate: -1 });

export default mongoose.model<ISalaryStructureAssignment>(
  "SalaryStructureAssignment",
  salaryStructureAssignmentSchema
);

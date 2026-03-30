import mongoose, { Document, Schema } from "mongoose";

export interface IAppraisalCycle extends Document {
  name: string;
  company?: string;
  fromDate: Date;
  toDate: Date;
  type?: string;
  status?: string;
  description?: string;
}

const appraisalCycleSchema = new Schema<IAppraisalCycle>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    company: String,
    fromDate: { type: Date, required: true },
    toDate: { type: Date, required: true },
    type: {
      type: String,
      enum: ["Annual", "Semi Annual", "Quarterly", "Monthly", ""],
      default: "",
    },
    status: {
      type: String,
      enum: ["Not Started", "In Progress", "Completed"],
      default: "Not Started",
    },
    description: String,
  },
  { timestamps: true }
);

export default mongoose.model<IAppraisalCycle>("AppraisalCycle", appraisalCycleSchema);

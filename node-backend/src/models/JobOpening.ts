import mongoose, { Document, Schema } from "mongoose";

export interface IJobOpening extends Document {
  jobTitle: string;
  department?: mongoose.Types.ObjectId;
  designation?: mongoose.Types.ObjectId;
  company?: string;
  status?: string;
  plannedNumberOfPositions?: number;
  description?: string;
  skills?: string[];
  expectedSalaryMin?: number;
  expectedSalaryMax?: number;
  currency?: string;
  closingDate?: Date;
  hiringManager?: mongoose.Types.ObjectId;
  hrManager?: mongoose.Types.ObjectId;
}

const jobOpeningSchema = new Schema<IJobOpening>(
  {
    jobTitle: { type: String, required: true, trim: true },
    department: { type: Schema.Types.ObjectId, ref: "Department" },
    designation: { type: Schema.Types.ObjectId, ref: "Designation" },
    company: String,
    status: {
      type: String,
      enum: ["Open", "Closed", "On Hold"],
      default: "Open",
    },
    plannedNumberOfPositions: { type: Number, default: 1 },
    description: String,
    skills: [String],
    expectedSalaryMin: { type: Number, default: 0 },
    expectedSalaryMax: { type: Number, default: 0 },
    currency: { type: String, default: "INR" },
    closingDate: Date,
    hiringManager: { type: Schema.Types.ObjectId, ref: "Employee" },
    hrManager: { type: Schema.Types.ObjectId, ref: "Employee" },
  },
  { timestamps: true }
);

export default mongoose.model<IJobOpening>("JobOpening", jobOpeningSchema);

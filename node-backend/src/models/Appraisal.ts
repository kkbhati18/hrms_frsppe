import mongoose, { Document, Schema } from "mongoose";

export interface IAppraisalGoal {
  kra?: string;
  description?: string;
  weightage?: number;
  perObjectives?: number;
  score?: number;
  goalCompletion?: number;
  contribution?: number;
}

export interface IAppraisal extends Document {
  employee: mongoose.Types.ObjectId;
  appraisalCycle?: mongoose.Types.ObjectId;
  appraisalTemplate?: mongoose.Types.ObjectId;
  kra?: IAppraisalGoal[];
  company?: string;
  startDate?: Date;
  endDate?: Date;
  overallScore?: number;
  finalScore?: number;
  grade?: string;
  status?: string;
  reviewedBy?: mongoose.Types.ObjectId;
  remarks?: string;
}

const appraisalGoalSchema = new Schema<IAppraisalGoal>(
  {
    kra: { type: String, trim: true },
    description: String,
    weightage: { type: Number, default: 0, min: 0, max: 100 },
    perObjectives: Number,
    score: Number,
    goalCompletion: Number,
    contribution: Number,
  },
  { _id: false }
);

const appraisalSchema = new Schema<IAppraisal>(
  {
    employee: { type: Schema.Types.ObjectId, ref: "Employee", required: true },
    appraisalCycle: { type: Schema.Types.ObjectId, ref: "AppraisalCycle" },
    appraisalTemplate: { type: Schema.Types.ObjectId, ref: "AppraisalTemplate" },
    kra: [appraisalGoalSchema],
    company: String,
    startDate: Date,
    endDate: Date,
    overallScore: { type: Number, default: 0 },
    finalScore: { type: Number, default: 0 },
    grade: String,
    status: {
      type: String,
      enum: ["Draft", "Self Appraisal Pending", "Submitted", "Completed", "Cancelled"],
      default: "Draft",
    },
    reviewedBy: { type: Schema.Types.ObjectId, ref: "Employee" },
    remarks: String,
  },
  { timestamps: true }
);

appraisalSchema.index({ employee: 1, status: 1 });

export default mongoose.model<IAppraisal>("Appraisal", appraisalSchema);

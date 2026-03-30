import mongoose, { Document, Schema } from "mongoose";

export interface IInterviewDetail {
  interviewer?: mongoose.Types.ObjectId;
  rating?: number;
  comments?: string;
}

export interface IInterview extends Document {
  jobApplicant: mongoose.Types.ObjectId;
  jobOpening?: mongoose.Types.ObjectId;
  interviewRound?: string;
  scheduledOn: Date;
  duration?: number;
  status?: string;
  interviewers?: IInterviewDetail[];
  rating?: number;
  notes?: string;
  resume?: string;
}

const interviewDetailSchema = new Schema<IInterviewDetail>(
  {
    interviewer: { type: Schema.Types.ObjectId, ref: "Employee" },
    rating: { type: Number, min: 0, max: 5 },
    comments: String,
  },
  { _id: false }
);

const interviewSchema = new Schema<IInterview>(
  {
    jobApplicant: { type: Schema.Types.ObjectId, ref: "JobApplicant", required: true },
    jobOpening: { type: Schema.Types.ObjectId, ref: "JobOpening" },
    interviewRound: { type: String, default: "Round 1" },
    scheduledOn: { type: Date, required: true },
    duration: { type: Number, default: 60 },
    status: {
      type: String,
      enum: ["Pending", "Completed", "Cancelled"],
      default: "Pending",
    },
    interviewers: [interviewDetailSchema],
    rating: { type: Number, min: 0, max: 5 },
    notes: String,
    resume: String,
  },
  { timestamps: true }
);

export default mongoose.model<IInterview>("Interview", interviewSchema);

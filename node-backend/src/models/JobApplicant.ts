import mongoose, { Document, Schema } from "mongoose";

export interface IJobApplicant extends Document {
  applicantName: string;
  jobOpening: mongoose.Types.ObjectId;
  email?: string;
  phone?: string;
  resume?: string;
  status?: string;
  source?: string;
  coverLetter?: string;
  rating?: number;
  notes?: string;
}

const jobApplicantSchema = new Schema<IJobApplicant>(
  {
    applicantName: { type: String, required: true, trim: true },
    jobOpening: { type: Schema.Types.ObjectId, ref: "JobOpening", required: true },
    email: { type: String, lowercase: true, trim: true },
    phone: String,
    resume: String,
    status: {
      type: String,
      enum: ["Applied", "Screening", "Interview", "Offer", "Hired", "Rejected"],
      default: "Applied",
    },
    source: { type: String, enum: ["Website", "Referral", "LinkedIn", "Job Board", "Other", ""], default: "" },
    coverLetter: String,
    rating: { type: Number, min: 0, max: 5 },
    notes: String,
  },
  { timestamps: true }
);

jobApplicantSchema.index({ jobOpening: 1, status: 1 });

export default mongoose.model<IJobApplicant>("JobApplicant", jobApplicantSchema);

const mongoose = require("mongoose");

const jobApplicantSchema = new mongoose.Schema(
  {
    applicantName: { type: String, required: true, trim: true },
    email: { type: String, lowercase: true, trim: true },
    phone: String,
    jobOpening: { type: mongoose.Schema.Types.ObjectId, ref: "JobOpening" },
    status: {
      type: String,
      enum: [
        "Open",
        "Replied",
        "Hold",
        "Accepted",
        "Rejected",
        "Hired",
      ],
      default: "Open",
    },
    appliedOn: { type: Date, default: Date.now },
    resume: String, // file path
    coverLetter: String,
    source: String,
    linkedinProfile: String,
    portfolio: String,
    currentSalary: Number,
    expectedSalary: Number,
    noticePeriod: Number, // days
    rating: { type: Number, min: 0, max: 5 },
    notes: String,
    hrManager: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
  },
  { timestamps: true }
);

jobApplicantSchema.index({ jobOpening: 1, status: 1 });

module.exports = mongoose.model("JobApplicant", jobApplicantSchema);

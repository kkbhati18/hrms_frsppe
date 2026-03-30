const mongoose = require("mongoose");

const interviewDetailSchema = new mongoose.Schema(
  {
    interviewer: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
    scheduled: Boolean,
    interviewFeedback: { type: mongoose.Schema.Types.ObjectId, ref: "InterviewFeedback" },
  },
  { _id: false }
);

const interviewSchema = new mongoose.Schema(
  {
    jobApplicant: { type: mongoose.Schema.Types.ObjectId, ref: "JobApplicant", required: true },
    jobOpening: { type: mongoose.Schema.Types.ObjectId, ref: "JobOpening" },
    interviewRound: { type: String, trim: true },
    scheduledOn: { type: Date, required: true },
    endTime: Date,
    status: {
      type: String,
      enum: ["Pending", "Scheduled", "Under Review", "Selected", "Cleared", "Rejected", "Cancelled"],
      default: "Pending",
    },
    interviewers: [interviewDetailSchema],
    rating: { type: Number, min: 0, max: 5 },
    notes: String,
    company: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Interview", interviewSchema);

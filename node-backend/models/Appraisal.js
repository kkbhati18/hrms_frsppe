const mongoose = require("mongoose");

const appraisalGoalSchema = new mongoose.Schema(
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

const appraisalSchema = new mongoose.Schema(
  {
    employee: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
    appraisalCycle: { type: mongoose.Schema.Types.ObjectId, ref: "AppraisalCycle" },
    appraisalTemplate: { type: mongoose.Schema.Types.ObjectId, ref: "AppraisalTemplate" },
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
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
    remarks: String,
  },
  { timestamps: true }
);

appraisalSchema.index({ employee: 1, status: 1 });

module.exports = mongoose.model("Appraisal", appraisalSchema);

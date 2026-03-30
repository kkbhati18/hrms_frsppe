const mongoose = require("mongoose");

const appraisalCycleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    company: String,
    fromDate: { type: Date, required: true },
    toDate: { type: Date, required: true },
    type: { type: String, enum: ["Annual", "Semi Annual", "Quarterly", "Monthly", ""], default: "" },
    status: {
      type: String,
      enum: ["Not Started", "In Progress", "Completed"],
      default: "Not Started",
    },
    description: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("AppraisalCycle", appraisalCycleSchema);

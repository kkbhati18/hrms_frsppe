const mongoose = require("mongoose");

const jobOpeningSchema = new mongoose.Schema(
  {
    jobTitle: { type: String, required: true, trim: true },
    jobApplication: String,
    status: { type: String, enum: ["Open", "Closed", "On Hold", "Cancelled"], default: "Open" },
    department: { type: mongoose.Schema.Types.ObjectId, ref: "Department" },
    designation: { type: mongoose.Schema.Types.ObjectId, ref: "Designation" },
    company: { type: String, trim: true },
    location: String,
    noOfPositions: { type: Number, default: 1 },
    description: String,
    skills: [String],
    salaryFrom: Number,
    salaryTo: Number,
    currency: String,
    postedDate: { type: Date, default: Date.now },
    closingDate: Date,
    hiringManager: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
    hrManager: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("JobOpening", jobOpeningSchema);

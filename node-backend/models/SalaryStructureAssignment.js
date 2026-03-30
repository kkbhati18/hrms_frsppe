const mongoose = require("mongoose");

const salaryStructureAssignmentSchema = new mongoose.Schema(
  {
    employee: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
    salaryStructure: { type: mongoose.Schema.Types.ObjectId, ref: "SalaryStructure", required: true },
    fromDate: { type: Date, required: true },
    base: { type: Number, required: true, min: 0 },
    variable: { type: Number, default: 0 },
    currency: { type: String, default: "INR" },
    company: { type: String, trim: true },
    docStatus: { type: Number, enum: [0, 1, 2], default: 1 },
  },
  { timestamps: true }
);

salaryStructureAssignmentSchema.index({ employee: 1, fromDate: -1 });

module.exports = mongoose.model("SalaryStructureAssignment", salaryStructureAssignmentSchema);

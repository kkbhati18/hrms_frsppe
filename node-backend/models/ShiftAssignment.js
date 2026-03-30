const mongoose = require("mongoose");

const shiftAssignmentSchema = new mongoose.Schema(
  {
    employee: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
    shiftType: { type: mongoose.Schema.Types.ObjectId, ref: "ShiftType", required: true },
    company: { type: String, trim: true },
    startDate: { type: Date, required: true },
    endDate: Date,
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
    docStatus: { type: Number, enum: [0, 1, 2], default: 1 },
  },
  { timestamps: true }
);

shiftAssignmentSchema.index({ employee: 1, startDate: 1 });

module.exports = mongoose.model("ShiftAssignment", shiftAssignmentSchema);

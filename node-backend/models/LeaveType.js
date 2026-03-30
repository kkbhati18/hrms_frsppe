const mongoose = require("mongoose");

const leaveTypeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    maxLeavesAllowed: { type: Number, default: 0 },
    applicableAfter: { type: Number, default: 0 }, // months
    maxContinuousLeaves: { type: Number, default: 0 },
    isCarryForward: { type: Boolean, default: false },
    maxCarryForwardedLeaves: { type: Number, default: 0 },
    isEarnedLeave: { type: Boolean, default: false },
    isPaidLeave: { type: Boolean, default: true },
    isOptionalLeave: { type: Boolean, default: false },
    allowNegative: { type: Boolean, default: false },
    includeHoliday: { type: Boolean, default: false },
    includeWeekend: { type: Boolean, default: false },
    isCompensatory: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    description: String,
    color: String,
    icon: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("LeaveType", leaveTypeSchema);

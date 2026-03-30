const mongoose = require("mongoose");

const leaveApplicationSchema = new mongoose.Schema(
  {
    employee: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
    leaveType: { type: mongoose.Schema.Types.ObjectId, ref: "LeaveType", required: true },
    fromDate: { type: Date, required: true },
    toDate: { type: Date, required: true },
    halfDay: { type: Boolean, default: false },
    halfDayDate: Date,
    totalLeaveDays: { type: Number, default: 1 },
    description: String,
    reason: String,
    status: {
      type: String,
      enum: ["Open", "Approved", "Rejected", "Cancelled"],
      default: "Open",
    },
    leaveApprover: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    approvedAt: Date,
    rejectionReason: String,
    followWithCompensatory: { type: Boolean, default: false },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

leaveApplicationSchema.index({ employee: 1, status: 1 });
leaveApplicationSchema.index({ fromDate: 1, toDate: 1 });

module.exports = mongoose.model("LeaveApplication", leaveApplicationSchema);

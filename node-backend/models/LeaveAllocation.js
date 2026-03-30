const mongoose = require("mongoose");

const leaveAllocationSchema = new mongoose.Schema(
  {
    employee: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
    leaveType: { type: mongoose.Schema.Types.ObjectId, ref: "LeaveType", required: true },
    leavePeriod: { type: String, trim: true },
    fromDate: { type: Date, required: true },
    toDate: { type: Date, required: true },
    newLeaves: { type: Number, required: true, min: 0 },
    unusedLeaves: { type: Number, default: 0 },
    carryForwardedLeaves: { type: Number, default: 0 },
    totalLeavesAllocated: { type: Number, default: 0 },
    usedLeaves: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["Draft", "Submitted", "Cancelled"],
      default: "Submitted",
    },
    amendedFrom: { type: mongoose.Schema.Types.ObjectId, ref: "LeaveAllocation" },
    notes: String,
  },
  { timestamps: true }
);

leaveAllocationSchema.pre("save", function (next) {
  this.totalLeavesAllocated = this.newLeaves + (this.carryForwardedLeaves || 0);
  next();
});

leaveAllocationSchema.index({ employee: 1, leaveType: 1, fromDate: 1, toDate: 1 });

module.exports = mongoose.model("LeaveAllocation", leaveAllocationSchema);

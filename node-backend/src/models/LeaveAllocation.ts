import mongoose, { Document, Schema } from "mongoose";

export interface ILeaveAllocation extends Document {
  employee: mongoose.Types.ObjectId;
  leaveType: mongoose.Types.ObjectId;
  fromDate: Date;
  toDate: Date;
  newLeaves: number;
  carryForwardedLeaves?: number;
  totalLeavesAllocated?: number;
  usedLeaves?: number;
  status?: string;
  docStatus?: number;
}

const leaveAllocationSchema = new Schema<ILeaveAllocation>(
  {
    employee: { type: Schema.Types.ObjectId, ref: "Employee", required: true },
    leaveType: { type: Schema.Types.ObjectId, ref: "LeaveType", required: true },
    fromDate: { type: Date, required: true },
    toDate: { type: Date, required: true },
    newLeaves: { type: Number, required: true, default: 0 },
    carryForwardedLeaves: { type: Number, default: 0 },
    totalLeavesAllocated: { type: Number, default: 0 },
    usedLeaves: { type: Number, default: 0 },
    status: { type: String, enum: ["Draft", "Submitted", "Cancelled"], default: "Draft" },
    docStatus: { type: Number, enum: [0, 1, 2], default: 0 },
  },
  { timestamps: true }
);

leaveAllocationSchema.pre("save", function (next) {
  this.totalLeavesAllocated = (this.newLeaves || 0) + (this.carryForwardedLeaves || 0);
  next();
});

leaveAllocationSchema.index({ employee: 1, leaveType: 1 });

export default mongoose.model<ILeaveAllocation>("LeaveAllocation", leaveAllocationSchema);

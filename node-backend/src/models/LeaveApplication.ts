import mongoose, { Document, Schema } from "mongoose";

export interface ILeaveApplication extends Document {
  employee: mongoose.Types.ObjectId;
  leaveType: mongoose.Types.ObjectId;
  fromDate: Date;
  toDate: Date;
  totalLeaveDays?: number;
  halfDay?: boolean;
  halfDayDate?: Date;
  reason?: string;
  status?: string;
  leaveApprover?: mongoose.Types.ObjectId;
  approvedBy?: mongoose.Types.ObjectId;
  approvedAt?: Date;
  rejectionReason?: string;
  postedBy?: mongoose.Types.ObjectId;
  docStatus?: number;
}

const leaveApplicationSchema = new Schema<ILeaveApplication>(
  {
    employee: { type: Schema.Types.ObjectId, ref: "Employee", required: true },
    leaveType: { type: Schema.Types.ObjectId, ref: "LeaveType", required: true },
    fromDate: { type: Date, required: true },
    toDate: { type: Date, required: true },
    totalLeaveDays: { type: Number, default: 0 },
    halfDay: { type: Boolean, default: false },
    halfDayDate: Date,
    reason: String,
    status: {
      type: String,
      enum: ["Open", "Approved", "Rejected", "Cancelled"],
      default: "Open",
    },
    leaveApprover: { type: Schema.Types.ObjectId, ref: "Employee" },
    approvedBy: { type: Schema.Types.ObjectId, ref: "User" },
    approvedAt: Date,
    rejectionReason: String,
    postedBy: { type: Schema.Types.ObjectId, ref: "User" },
    docStatus: { type: Number, enum: [0, 1, 2], default: 0 },
  },
  { timestamps: true }
);

leaveApplicationSchema.index({ employee: 1, status: 1 });
leaveApplicationSchema.index({ fromDate: 1, toDate: 1 });

export default mongoose.model<ILeaveApplication>("LeaveApplication", leaveApplicationSchema);

import mongoose, { Document, Schema } from "mongoose";

export interface ILeaveType extends Document {
  name: string;
  maxDaysAllowed?: number;
  isCarryForward?: boolean;
  maxCarryForwardDays?: number;
  isPaidLeave?: boolean;
  isLWP?: boolean;
  isEarnedLeave?: boolean;
  earnedLeaveFrequency?: string;
  allowNegativeBalance?: boolean;
  allowEncashment?: boolean;
  encashmentThresholdDays?: number;
  isOptional?: boolean;
  applicableAfterWorkingDays?: number;
  maxContinuousDaysApplicable?: number;
  disabled?: boolean;
  description?: string;
}

const leaveTypeSchema = new Schema<ILeaveType>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    maxDaysAllowed: { type: Number, default: 0 },
    isCarryForward: { type: Boolean, default: false },
    maxCarryForwardDays: { type: Number, default: 0 },
    isPaidLeave: { type: Boolean, default: false },
    isLWP: { type: Boolean, default: false },
    isEarnedLeave: { type: Boolean, default: false },
    earnedLeaveFrequency: { type: String, enum: ["Monthly", "Quarterly", "Half Yearly", "Yearly", ""], default: "" },
    allowNegativeBalance: { type: Boolean, default: false },
    allowEncashment: { type: Boolean, default: false },
    encashmentThresholdDays: { type: Number, default: 0 },
    isOptional: { type: Boolean, default: false },
    applicableAfterWorkingDays: { type: Number, default: 0 },
    maxContinuousDaysApplicable: { type: Number, default: 0 },
    disabled: { type: Boolean, default: false },
    description: String,
  },
  { timestamps: true }
);

export default mongoose.model<ILeaveType>("LeaveType", leaveTypeSchema);

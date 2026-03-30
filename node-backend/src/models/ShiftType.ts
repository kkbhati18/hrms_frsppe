import mongoose, { Document, Schema } from "mongoose";

export interface IShiftType extends Document {
  name: string;
  startTime: string;
  endTime: string;
  lateEntryGracePeriod?: number;
  earlyExitGracePeriod?: number;
  workingHoursThresholdForHalfDay?: number;
  workingHoursThresholdForFullDay?: number;
  overtimeThreshold?: number;
  enableAutoAttendance?: boolean;
  processAttendanceAfter?: number;
  lastSyncOfCheckin?: Date;
  company?: string;
  disabled?: boolean;
}

const shiftTypeSchema = new Schema<IShiftType>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    lateEntryGracePeriod: { type: Number, default: 0 },
    earlyExitGracePeriod: { type: Number, default: 0 },
    workingHoursThresholdForHalfDay: { type: Number, default: 0 },
    workingHoursThresholdForFullDay: { type: Number, default: 0 },
    overtimeThreshold: { type: Number, default: 0 },
    enableAutoAttendance: { type: Boolean, default: false },
    processAttendanceAfter: { type: Number, default: 0 },
    lastSyncOfCheckin: Date,
    company: String,
    disabled: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<IShiftType>("ShiftType", shiftTypeSchema);

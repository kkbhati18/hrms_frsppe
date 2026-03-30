import mongoose, { Document, Schema } from "mongoose";

export interface IAttendance extends Document {
  employee: mongoose.Types.ObjectId;
  attendanceDate: Date;
  status: string;
  shift?: mongoose.Types.ObjectId;
  inTime?: string;
  outTime?: string;
  workingHours?: number;
  lateEntry?: boolean;
  earlyExit?: boolean;
  leaveType?: mongoose.Types.ObjectId;
  remarks?: string;
  docStatus?: number;
}

const attendanceSchema = new Schema<IAttendance>(
  {
    employee: { type: Schema.Types.ObjectId, ref: "Employee", required: true },
    attendanceDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ["Present", "Absent", "On Leave", "Half Day", "Work From Home"],
      required: true,
    },
    shift: { type: Schema.Types.ObjectId, ref: "ShiftType" },
    inTime: String,
    outTime: String,
    workingHours: { type: Number, default: 0 },
    lateEntry: { type: Boolean, default: false },
    earlyExit: { type: Boolean, default: false },
    leaveType: { type: Schema.Types.ObjectId, ref: "LeaveType" },
    remarks: String,
    docStatus: { type: Number, enum: [0, 1, 2], default: 0 },
  },
  { timestamps: true }
);

attendanceSchema.index({ employee: 1, attendanceDate: 1 }, { unique: true });

export default mongoose.model<IAttendance>("Attendance", attendanceSchema);

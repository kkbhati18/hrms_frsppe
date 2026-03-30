import mongoose, { Document, Schema } from "mongoose";

export interface IEmployeeCheckin extends Document {
  employee: mongoose.Types.ObjectId;
  logType: string;
  time: Date;
  shiftType?: mongoose.Types.ObjectId;
  shiftStart?: Date;
  shiftEnd?: Date;
  device?: string;
  skipAutoAttendance?: boolean;
  location?: {
    latitude?: number;
    longitude?: number;
    address?: string;
  };
}

const employeeCheckinSchema = new Schema<IEmployeeCheckin>(
  {
    employee: { type: Schema.Types.ObjectId, ref: "Employee", required: true },
    logType: { type: String, enum: ["IN", "OUT"], required: true },
    time: { type: Date, required: true },
    shiftType: { type: Schema.Types.ObjectId, ref: "ShiftType" },
    shiftStart: Date,
    shiftEnd: Date,
    device: String,
    skipAutoAttendance: { type: Boolean, default: false },
    location: {
      latitude: Number,
      longitude: Number,
      address: String,
    },
  },
  { timestamps: true }
);

employeeCheckinSchema.index({ employee: 1, time: -1 });

export default mongoose.model<IEmployeeCheckin>("EmployeeCheckin", employeeCheckinSchema);

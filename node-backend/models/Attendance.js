const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    employee: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
    attendanceDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ["Present", "Absent", "On Leave", "Half Day", "Work From Home"],
      required: true,
    },
    shift: { type: mongoose.Schema.Types.ObjectId, ref: "ShiftType" },
    inTime: Date,
    outTime: Date,
    workingHours: Number,
    lateEntry: { type: Boolean, default: false },
    earlyExit: { type: Boolean, default: false },
    overtime: { type: Number, default: 0 }, // hours
    leaveType: { type: mongoose.Schema.Types.ObjectId, ref: "LeaveType" },
    leaveApplication: { type: mongoose.Schema.Types.ObjectId, ref: "LeaveApplication" },
    company: { type: String, trim: true },
    docStatus: { type: Number, enum: [0, 1, 2], default: 1 }, // 0=Draft,1=Submitted,2=Cancelled
    remarks: String,
  },
  { timestamps: true }
);

attendanceSchema.index({ employee: 1, attendanceDate: 1 }, { unique: true });

module.exports = mongoose.model("Attendance", attendanceSchema);

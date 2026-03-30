const mongoose = require("mongoose");

const employeeCheckinSchema = new mongoose.Schema(
  {
    employee: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
    logType: { type: String, enum: ["IN", "OUT"], required: true },
    time: { type: Date, required: true },
    device: String,
    location: {
      latitude: Number,
      longitude: Number,
      address: String,
    },
    skipAutoAttendance: { type: Boolean, default: false },
    attendance: { type: mongoose.Schema.Types.ObjectId, ref: "Attendance" },
    shift: { type: mongoose.Schema.Types.ObjectId, ref: "ShiftType" },
    shiftStart: Date,
    shiftActualStart: Date,
    shiftEnd: Date,
    shiftActualEnd: Date,
  },
  { timestamps: true }
);

employeeCheckinSchema.index({ employee: 1, time: -1 });

module.exports = mongoose.model("EmployeeCheckin", employeeCheckinSchema);

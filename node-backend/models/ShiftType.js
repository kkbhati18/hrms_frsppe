const mongoose = require("mongoose");

const shiftTypeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    startTime: { type: String, required: true }, // "HH:MM"
    endTime: { type: String, required: true },
    color: String,
    holidayList: { type: mongoose.Schema.Types.ObjectId, ref: "HolidayList" },
    autoAttendance: { type: Boolean, default: false },

    // Late entry / early exit grace
    lateEntryGracePeriod: { type: Number, default: 0 },
    earlyExitGracePeriod: { type: Number, default: 0 },

    // Working hours
    workingHoursThresholdForHalfDay: { type: Number, default: 0 },
    workingHoursThresholdForAbsent: { type: Number, default: 0 },
    maxWorkHours: { type: Number, default: 8 },

    disabled: { type: Boolean, default: false },
    description: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("ShiftType", shiftTypeSchema);

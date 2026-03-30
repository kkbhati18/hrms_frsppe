const mongoose = require("mongoose");

const trainingEventSchema = new mongoose.Schema(
  {
    eventName: { type: String, required: true, trim: true },
    type: { type: String, enum: ["Internal", "External", ""], default: "" },
    startTime: { type: Date, required: true },
    endTime: Date,
    location: String,
    attendees: [
      {
        employee: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
        optional: { type: Boolean, default: false },
        attendanceStatus: {
          type: String,
          enum: ["Invited", "Accepted", "Declined", "Attended"],
          default: "Invited",
        },
      },
    ],
    trainer: String,
    agenda: String,
    status: {
      type: String,
      enum: ["Scheduled", "Completed", "Cancelled"],
      default: "Scheduled",
    },
    company: String,
    trainingProgram: { type: mongoose.Schema.Types.ObjectId, ref: "TrainingProgram" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("TrainingEvent", trainingEventSchema);

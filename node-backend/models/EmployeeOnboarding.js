const mongoose = require("mongoose");

const boardingActivitySchema = new mongoose.Schema(
  {
    activity: { type: String, required: true },
    role: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    required: { type: Boolean, default: true },
    completed: { type: Boolean, default: false },
    completedOn: Date,
    description: String,
  },
  { _id: false }
);

const employeeOnboardingSchema = new mongoose.Schema(
  {
    employee: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
    firstName: { type: String, required: true },
    lastName: String,
    boardingBegins: { type: Date, required: true },
    dateOfJoining: Date,
    department: { type: mongoose.Schema.Types.ObjectId, ref: "Department" },
    designation: { type: mongoose.Schema.Types.ObjectId, ref: "Designation" },
    company: String,
    onboardingTemplate: { type: mongoose.Schema.Types.ObjectId, ref: "EmployeeOnboardingTemplate" },
    activities: [boardingActivitySchema],
    status: {
      type: String,
      enum: ["Pending", "In Process", "Completed", "Cancelled"],
      default: "Pending",
    },
    docStatus: { type: Number, enum: [0, 1, 2], default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("EmployeeOnboarding", employeeOnboardingSchema);

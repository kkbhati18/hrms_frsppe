import mongoose, { Document, Schema } from "mongoose";

export interface IBoardingActivity {
  activity: string;
  role?: string;
  user?: mongoose.Types.ObjectId;
  required?: boolean;
  completed?: boolean;
  completedOn?: Date;
  description?: string;
}

export interface IEmployeeOnboarding extends Document {
  employee?: mongoose.Types.ObjectId;
  firstName: string;
  lastName?: string;
  boardingBegins: Date;
  dateOfJoining?: Date;
  department?: mongoose.Types.ObjectId;
  designation?: mongoose.Types.ObjectId;
  company?: string;
  onboardingTemplate?: mongoose.Types.ObjectId;
  activities?: IBoardingActivity[];
  status?: string;
  docStatus?: number;
}

const boardingActivitySchema = new Schema<IBoardingActivity>(
  {
    activity: { type: String, required: true },
    role: String,
    user: { type: Schema.Types.ObjectId, ref: "User" },
    required: { type: Boolean, default: true },
    completed: { type: Boolean, default: false },
    completedOn: Date,
    description: String,
  },
  { _id: false }
);

const employeeOnboardingSchema = new Schema<IEmployeeOnboarding>(
  {
    employee: { type: Schema.Types.ObjectId, ref: "Employee" },
    firstName: { type: String, required: true },
    lastName: String,
    boardingBegins: { type: Date, required: true },
    dateOfJoining: Date,
    department: { type: Schema.Types.ObjectId, ref: "Department" },
    designation: { type: Schema.Types.ObjectId, ref: "Designation" },
    company: String,
    onboardingTemplate: { type: Schema.Types.ObjectId, ref: "EmployeeOnboardingTemplate" },
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

export default mongoose.model<IEmployeeOnboarding>("EmployeeOnboarding", employeeOnboardingSchema);

import mongoose, { Document, Schema } from "mongoose";

export interface IShiftAssignment extends Document {
  employee: mongoose.Types.ObjectId;
  shiftType: mongoose.Types.ObjectId;
  company?: string;
  startDate: Date;
  endDate?: Date;
  status?: string;
}

const shiftAssignmentSchema = new Schema<IShiftAssignment>(
  {
    employee: { type: Schema.Types.ObjectId, ref: "Employee", required: true },
    shiftType: { type: Schema.Types.ObjectId, ref: "ShiftType", required: true },
    company: String,
    startDate: { type: Date, required: true },
    endDate: Date,
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
  },
  { timestamps: true }
);

shiftAssignmentSchema.index({ employee: 1, startDate: 1 });

export default mongoose.model<IShiftAssignment>("ShiftAssignment", shiftAssignmentSchema);

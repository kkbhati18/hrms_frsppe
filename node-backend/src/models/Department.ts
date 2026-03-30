import mongoose, { Document, Schema } from "mongoose";

export interface IDepartment extends Document {
  name: string;
  company?: string;
  parentDepartment?: mongoose.Types.ObjectId;
  isGroup?: boolean;
  disabled?: boolean;
}

const departmentSchema = new Schema<IDepartment>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    company: String,
    parentDepartment: { type: Schema.Types.ObjectId, ref: "Department" },
    isGroup: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<IDepartment>("Department", departmentSchema);

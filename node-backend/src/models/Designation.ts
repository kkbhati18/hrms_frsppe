import mongoose, { Document, Schema } from "mongoose";

export interface IDesignation extends Document {
  name: string;
  description?: string;
  disabled?: boolean;
}

const designationSchema = new Schema<IDesignation>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: String,
    disabled: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<IDesignation>("Designation", designationSchema);

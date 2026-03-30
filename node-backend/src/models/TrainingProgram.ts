import mongoose, { Document, Schema } from "mongoose";

export interface ITrainingProgram extends Document {
  name: string;
  description?: string;
  disabled?: boolean;
}

const trainingProgramSchema = new Schema<ITrainingProgram>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: String,
    disabled: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<ITrainingProgram>("TrainingProgram", trainingProgramSchema);

import mongoose, { Document, Schema } from "mongoose";

export interface IEventAttendee {
  employee?: mongoose.Types.ObjectId;
  optional?: boolean;
  attendanceStatus?: string;
}

export interface ITrainingEvent extends Document {
  eventName: string;
  type?: string;
  startTime: Date;
  endTime?: Date;
  location?: string;
  attendees?: IEventAttendee[];
  trainer?: string;
  agenda?: string;
  status?: string;
  company?: string;
  trainingProgram?: mongoose.Types.ObjectId;
}

const trainingEventSchema = new Schema<ITrainingEvent>(
  {
    eventName: { type: String, required: true, trim: true },
    type: { type: String, enum: ["Internal", "External", ""], default: "" },
    startTime: { type: Date, required: true },
    endTime: Date,
    location: String,
    attendees: [
      {
        employee: { type: Schema.Types.ObjectId, ref: "Employee" },
        optional: { type: Boolean, default: false },
        attendanceStatus: {
          type: String,
          enum: ["Invited", "Accepted", "Declined", "Attended"],
          default: "Invited",
        },
        _id: false,
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
    trainingProgram: { type: Schema.Types.ObjectId, ref: "TrainingProgram" },
  },
  { timestamps: true }
);

export default mongoose.model<ITrainingEvent>("TrainingEvent", trainingEventSchema);

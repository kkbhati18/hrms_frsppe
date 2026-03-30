import mongoose, { Document, Schema } from "mongoose";

export interface IHoliday {
  date: Date;
  description?: string;
  weekly_off?: boolean;
}

export interface IHolidayList extends Document {
  name: string;
  fromDate: Date;
  toDate: Date;
  totalHolidays?: number;
  holidays?: IHoliday[];
  country?: string;
  subdivision?: string;
}

const holidaySchema = new Schema<IHoliday>(
  {
    date: { type: Date, required: true },
    description: String,
    weekly_off: { type: Boolean, default: false },
  },
  { _id: false }
);

const holidayListSchema = new Schema<IHolidayList>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    fromDate: { type: Date, required: true },
    toDate: { type: Date, required: true },
    totalHolidays: { type: Number, default: 0 },
    holidays: [holidaySchema],
    country: String,
    subdivision: String,
  },
  { timestamps: true }
);

export default mongoose.model<IHolidayList>("HolidayList", holidayListSchema);

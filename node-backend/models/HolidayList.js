const mongoose = require("mongoose");

const holidaySchema = new mongoose.Schema({
  date: { type: Date, required: true },
  description: { type: String, required: true },
  weekly_off: { type: Boolean, default: false },
}, { _id: false });

const holidayListSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    country: String,
    subdivisionCode: String,
    fromDate: { type: Date, required: true },
    toDate: { type: Date, required: true },
    totalHolidays: { type: Number, default: 0 },
    holidays: [holidaySchema],
    disabled: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("HolidayList", holidayListSchema);

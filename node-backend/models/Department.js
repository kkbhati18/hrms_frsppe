const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    company: { type: String, required: true, trim: true },
    parentDepartment: { type: mongoose.Schema.Types.ObjectId, ref: "Department" },
    isGroup: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Department", departmentSchema);

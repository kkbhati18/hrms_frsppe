const mongoose = require("mongoose");

const trainingProgramSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: String,
    disabled: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("TrainingProgram", trainingProgramSchema);

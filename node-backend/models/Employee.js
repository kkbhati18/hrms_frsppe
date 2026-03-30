const mongoose = require("mongoose");

const educationSchema = new mongoose.Schema({
  school: String,
  qualification: String,
  level: String,
  year: Number,
}, { _id: false });

const emergencyContactSchema = new mongoose.Schema({
  name: String,
  relation: String,
  phone: String,
}, { _id: false });

const employeeSchema = new mongoose.Schema(
  {
    employeeId: { type: String, unique: true, sparse: true, trim: true },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    middleName: { type: String, trim: true },
    fullName: { type: String, trim: true },
    gender: { type: String, enum: ["Male", "Female", "Other", ""], default: "" },
    dateOfBirth: Date,
    dateOfJoining: { type: Date, required: true },
    dateOfRetirement: Date,
    relievingDate: Date,

    status: {
      type: String,
      enum: ["Active", "Inactive", "Left", "On Leave"],
      default: "Active",
    },

    department: { type: mongoose.Schema.Types.ObjectId, ref: "Department" },
    designation: { type: mongoose.Schema.Types.ObjectId, ref: "Designation" },
    reportsTo: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
    company: { type: String, required: true, trim: true },
    branch: { type: String, trim: true },
    grade: { type: String, trim: true },
    employmentType: { type: String, trim: true },

    // Contact
    phone: { type: String, trim: true },
    personalEmail: { type: String, lowercase: true, trim: true },
    companyEmail: { type: String, lowercase: true, trim: true },
    permanentAddress: String,
    currentAddress: String,

    // Identity
    passportNumber: String,
    panNumber: String,
    aadhaarNumber: String,

    // Bank
    bankAccountNo: String,
    bankName: String,
    ifscCode: String,

    // Family
    maritalStatus: { type: String, enum: ["Single", "Married", "Divorced", "Widowed", ""] },
    spouseName: String,
    numberOfDependants: Number,

    education: [educationSchema],
    emergencyContacts: [emergencyContactSchema],

    // Profile image
    image: String,

    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    // Custom fields
    customFields: { type: Map, of: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);

// Auto-populate fullName
employeeSchema.pre("save", function (next) {
  this.fullName = [this.firstName, this.middleName, this.lastName].filter(Boolean).join(" ");
  next();
});

employeeSchema.index({ status: 1 });
employeeSchema.index({ department: 1 });
employeeSchema.index({ company: 1 });

module.exports = mongoose.model("Employee", employeeSchema);

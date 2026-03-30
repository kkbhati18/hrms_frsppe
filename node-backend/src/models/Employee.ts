import mongoose, { Document, Schema } from "mongoose";

export interface IEducation {
  school?: string;
  qualification?: string;
  level?: string;
  yearOfPassing?: number;
  percentage?: number;
  description?: string;
}

export interface IEmergencyContact {
  name?: string;
  relation?: string;
  phone?: string;
}

export interface IEmployee extends Document {
  employeeId?: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  fullName?: string;
  salutation?: string;
  gender?: string;
  dateOfBirth?: Date;
  maritalStatus?: string;
  bloodGroup?: string;
  nationality?: string;
  company: string;
  department?: mongoose.Types.ObjectId;
  designation?: mongoose.Types.ObjectId;
  reportsTo?: mongoose.Types.ObjectId;
  dateOfJoining: Date;
  dateOfConfirmation?: Date;
  scheduledConfirmationDate?: Date;
  noticeNumberOfDays?: number;
  relievingDate?: Date;
  status?: string;
  employmentType?: string;
  companyEmail?: string;
  personalEmail?: string;
  mobile?: string;
  phone?: string;
  image?: string;
  currentAddress?: string;
  permanentAddress?: string;
  education?: IEducation[];
  emergencyContacts?: IEmergencyContact[];
  bankName?: string;
  bankAccountNo?: string;
  ifscCode?: string;
  pan?: string;
  aadhaar?: string;
}

const educationSchema = new Schema<IEducation>(
  {
    school: String,
    qualification: String,
    level: String,
    yearOfPassing: Number,
    percentage: Number,
    description: String,
  },
  { _id: false }
);

const emergencyContactSchema = new Schema<IEmergencyContact>(
  { name: String, relation: String, phone: String },
  { _id: false }
);

const employeeSchema = new Schema<IEmployee>(
  {
    employeeId: { type: String, unique: true, sparse: true },
    firstName: { type: String, required: true, trim: true },
    middleName: String,
    lastName: { type: String, required: true, trim: true },
    fullName: String,
    salutation: { type: String, enum: ["Mr", "Ms", "Mrs", "Dr", "Prof", ""] },
    gender: { type: String, enum: ["Male", "Female", "Other", ""] },
    dateOfBirth: Date,
    maritalStatus: { type: String, enum: ["Single", "Married", "Divorced", "Widowed", ""] },
    bloodGroup: String,
    nationality: String,
    company: { type: String, required: true },
    department: { type: Schema.Types.ObjectId, ref: "Department" },
    designation: { type: Schema.Types.ObjectId, ref: "Designation" },
    reportsTo: { type: Schema.Types.ObjectId, ref: "Employee" },
    dateOfJoining: { type: Date, required: true },
    dateOfConfirmation: Date,
    scheduledConfirmationDate: Date,
    noticeNumberOfDays: { type: Number, default: 0 },
    relievingDate: Date,
    status: { type: String, enum: ["Active", "Inactive", "Left"], default: "Active" },
    employmentType: {
      type: String,
      enum: ["Full-time", "Part-time", "Contract", "Intern", ""],
      default: "Full-time",
    },
    companyEmail: { type: String, lowercase: true, trim: true },
    personalEmail: { type: String, lowercase: true, trim: true },
    mobile: String,
    phone: String,
    image: String,
    currentAddress: String,
    permanentAddress: String,
    education: [educationSchema],
    emergencyContacts: [emergencyContactSchema],
    bankName: String,
    bankAccountNo: String,
    ifscCode: String,
    pan: String,
    aadhaar: String,
  },
  { timestamps: true }
);

employeeSchema.pre("save", function (next) {
  this.fullName =
    `${this.firstName}${this.middleName ? " " + this.middleName : ""} ${this.lastName}`.trim();
  next();
});

employeeSchema.index({ company: 1, status: 1 });
employeeSchema.index({ department: 1 });
employeeSchema.index({ companyEmail: 1 }, { sparse: true });

export default mongoose.model<IEmployee>("Employee", employeeSchema);

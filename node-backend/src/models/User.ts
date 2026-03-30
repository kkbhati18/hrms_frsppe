import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  email: string;
  password: string;
  fullName: string;
  role: string;
  isActive: boolean;
  lastLogin?: Date;
  refreshToken?: string;
  matchPassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 8, select: false },
    fullName: { type: String, required: true, trim: true },
    role: {
      type: String,
      enum: [
        "System Manager",
        "HR Manager",
        "HR User",
        "Employee",
        "Leave Approver",
        "Expense Approver",
        "Payroll Manager",
      ],
      default: "Employee",
    },
    isActive: { type: Boolean, default: true },
    lastLogin: Date,
    refreshToken: { type: String, select: false },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.matchPassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>("User", userSchema);

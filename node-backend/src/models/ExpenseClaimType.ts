import mongoose, { Document, Schema } from "mongoose";

export interface IExpenseClaimTypeAccount {
  company?: string;
  defaultAccount?: string;
}

export interface IExpenseClaimType extends Document {
  name: string;
  description?: string;
  accounts?: IExpenseClaimTypeAccount[];
  disabled?: boolean;
}

const expenseClaimTypeSchema = new Schema<IExpenseClaimType>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: String,
    accounts: [
      {
        company: String,
        defaultAccount: String,
        _id: false,
      },
    ],
    disabled: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<IExpenseClaimType>("ExpenseClaimType", expenseClaimTypeSchema);

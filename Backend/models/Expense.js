import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    description: { type: String, required: true },
    amount: { type: Number, required: true },
    category: { type: String, required: true },
    subCategory: String,
    date: { type: Date, default: Date.now },
    paymentMethod: {
      type: String,
      enum: ["cash", "card", "bank_transfer", "cheque"],
      required: true,
    },
    vendor: String,
    receipt: String, // file path
    taxDeductible: { type: Boolean, default: false },
    notes: String,
    aiCategory: String, // AI-suggested category
    aiConfidence: Number, // AI confidence score
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Expense", expenseSchema);

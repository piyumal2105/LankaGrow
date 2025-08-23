import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: String,
    phone: { type: String, required: true },
    address: {
      street: String,
      city: String,
      province: String,
      postalCode: String,
    },
    customerType: {
      type: String,
      enum: ["individual", "business"],
      default: "individual",
    },
    businessName: String,
    taxId: String,
    creditLimit: { type: Number, default: 0 },
    currentBalance: { type: Number, default: 0 },
    paymentTerms: { type: Number, default: 30 }, // days
    loyaltyPoints: { type: Number, default: 0 },
    totalPurchases: { type: Number, default: 0 },
    lastPurchase: Date,
    notes: String,
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    aiInsights: {
      purchasePattern: String,
      preferredProducts: [String],
      riskLevel: {
        type: String,
        enum: ["low", "medium", "high"],
        default: "low",
      },
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Customer", customerSchema);

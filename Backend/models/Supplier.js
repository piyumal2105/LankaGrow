import mongoose from "mongoose";

const supplierSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    contactPerson: String,
    email: String,
    phone: { type: String, required: true },
    address: {
      street: String,
      city: String,
      province: String,
      postalCode: String,
    },
    taxId: String,
    paymentTerms: { type: Number, default: 30 },
    categories: [String], // product categories they supply
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    rating: { type: Number, min: 1, max: 5 },
    notes: String,
    totalOrders: { type: Number, default: 0 },
    totalValue: { type: Number, default: 0 },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Supplier", supplierSchema);

import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    sku: { type: String, unique: true, required: true },
    barcode: String,
    category: { type: String, required: true },
    subCategory: String,
    brand: String,
    unit: { type: String, required: true }, // pieces, kg, liters, etc.
    purchasePrice: { type: Number, required: true },
    sellingPrice: { type: Number, required: true },
    minStockLevel: { type: Number, default: 10 },
    currentStock: { type: Number, default: 0 },
    location: String, // warehouse location
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier" },
    expiryDate: Date,
    images: [String],
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    aiTags: [String], // AI-generated tags
    profitMargin: Number,
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

productSchema.index({ name: "text", description: "text", category: "text" });
productSchema.virtual("totalValue").get(function () {
  return this.currentStock * this.purchasePrice;
});

export default mongoose.model("Product", productSchema);

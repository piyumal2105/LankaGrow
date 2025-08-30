import mongoose from "mongoose";

const invoiceItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  productName: String,
  quantity: { type: Number, required: true },
  unitPrice: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  total: { type: Number, required: true },
});

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: { type: String, unique: true, required: false },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    items: [invoiceItemSchema],
    subtotal: { type: Number, required: true },
    taxRate: { type: Number, default: 0 }, // VAT percentage
    taxAmount: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["draft", "sent", "paid", "overdue", "cancelled"],
      default: "draft",
    },
    dueDate: { type: Date, required: true },
    paidDate: Date,
    paymentMethod: {
      type: String,
      enum: ["cash", "card", "bank_transfer", "cheque", "mobile_payment"],
    },
    notes: String,
    terms: String,
    recurring: {
      isRecurring: { type: Boolean, default: false },
      frequency: {
        type: String,
        enum: ["weekly", "monthly", "quarterly", "yearly"],
      },
      nextInvoiceDate: Date,
    },
    aiFollowUp: {
      lastReminderSent: Date,
      reminderCount: { type: Number, default: 0 },
      suggestedAction: String,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

invoiceSchema.pre("save", function (next) {
  if (this.isNew && !this.invoiceNumber) {
    this.invoiceNumber = `INV-${Date.now()}`;
  }
  next();
});

export default mongoose.model("Invoice", invoiceSchema);

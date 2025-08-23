import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "manager", "staff"],
      default: "staff",
    },
    businessName: { type: String, required: true },
    businessType: { type: String, required: true },
    phone: { type: String, required: true },
    address: {
      street: String,
      city: String,
      province: String,
      country: { type: String, default: "Sri Lanka" },
    },
    subscription: {
      plan: {
        type: String,
        enum: ["Smart Start", "Business Pro", "Growth Master"],
        default: "Smart Start",
      },
      status: {
        type: String,
        enum: ["active", "inactive", "trial"],
        default: "trial",
      },
      startDate: { type: Date, default: Date.now },
      endDate: Date,
    },
    isActive: { type: Boolean, default: true },
    lastLogin: Date,
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

export default mongoose.model("User", userSchema);

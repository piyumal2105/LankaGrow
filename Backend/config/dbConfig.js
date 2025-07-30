import mongoose from "mongoose";
import "dotenv/config";

const databaseConnect = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log("🖥️  Database Connected...");
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
};

export default databaseConnect;

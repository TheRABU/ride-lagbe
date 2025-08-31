import mongoose from "mongoose";

export const connectDatabase = async () => {
  try {
    const uri = process.env.DB_URI;
    if (!uri) {
      throw new Error("DB_URI is not defined in environment variables");
    }
    await mongoose.connect(uri);
    console.log("DB connection successful!");
  } catch (error: any) {
    console.log("Error at connectDB::", error.message);
    throw error;
  }
};

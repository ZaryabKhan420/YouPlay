import mongoose from "mongoose";
import { DB_Name } from "../constants.js";

export const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URL}/${DB_Name}`
    );
    console.log("MongoDB Connected");
  } catch (error) {
    console.log("Error in MongoDB Connection", error);
  }
};

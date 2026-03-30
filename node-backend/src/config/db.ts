import mongoose from "mongoose";
import logger from "../utils/logger";

const connectDB = async (): Promise<void> => {
  const uri = process.env.MONGO_URI || "mongodb://localhost:27017/hrms";
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    logger.info(`MongoDB connected: ${mongoose.connection.host}`);
  } catch (err) {
    logger.error("MongoDB connection error:", (err as Error).message);
    process.exit(1);
  }

  mongoose.connection.on("disconnected", () => logger.warn("MongoDB disconnected"));
  mongoose.connection.on("reconnected", () => logger.info("MongoDB reconnected"));
};

export default connectDB;

import "dotenv/config";
import mongoose from "mongoose";
import { mongodbLogger } from "../utils/logger.js";

/**
 * @file MongoDB configuration file
 * @description This file contains the configuration for connecting to MongoDB using Mongoose.
 * It exports a function to connect to the database.
 */

export async function connectDB() {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {});
    console.log("\n")
    mongodbLogger.info(
      `MongoDB Connected: ${conn.connection.host} [ Environment : ${process.env.NODE_ENV} ]`
    );
  } catch (err) {
    mongodbLogger.error("MongoDB connection error:", err);
    process.exit(1);
  }
}

export const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    mongodbLogger.log("MongoDB disconnected!");
  } catch (error) {
    mongodbLogger.error("Error while disconnecting MongoDB!", error);
  }
};

import "dotenv/config";
import mongoose from "mongoose";
import logger from "../utils/logger.js";

/**
 * @file MongoDB configuration file
 * @description This file contains the configuration for connecting to MongoDB using Mongoose.
 * It exports a function to connect to the database.
 */

export async function connectDB() {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {});
    logger.info(
      `MongoDB Connected: ${conn.connection.host} [ Environment : ${process.env.NODE_ENV} ]`
    );
  } catch (err) {
    logger.error("MongoDB connection error:", err);
    process.exit(1);
  }
}

export const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    logger.log("MongoDB disconnected!");
  } catch (error) {
    logger.error("Error while disconnecting MongoDB!", error);
  }
};

import "dotenv/config";
import { v2 as cloudinary } from "cloudinary";

/**
 * @file Cloudinary configuration file
 * @description This file configures Cloudinary for image and video uploads.
 * It exports the configured Cloudinary instance.
 */

cloudinary.config({
  cloud_name: process.env.CLOUNDINARY_CLOUD_NAME,
  api_key: process.env.CLOUNDINARY_API_KEY,
  api_secret: process.env.CLOUNDINARY_API_SECRET,
  secure: process.env.NODE_ENV === "production",
});

  
export default cloudinary;

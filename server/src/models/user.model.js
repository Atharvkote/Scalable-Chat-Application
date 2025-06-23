import mongoose from "mongoose";

/**
 * @file MongoDB User Schema Defination file
 * @description This file defines the Mongoose schema for the User model.
 * It includes fields for email, password, full_name, profile picture, and bio.
 */

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    full_name: { type: String, required: true },
    profile_picture: { type: String, default: "" },
    bio: { type: String, default: "" },
    o_auth_provider: { type: String, default: "local" },
    o_auth_id: { type: String, default: "" },

  },
  { timestamps: true }
);

const UserModel = mongoose.model("users", userSchema);
export default UserModel;

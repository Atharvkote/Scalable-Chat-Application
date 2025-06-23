import "dotenv/config";
import UserModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../libs/generateToken.js";
import logger from "../utils/logger.js";
import { schemas } from "../validators/schema.js";
import cloudinary from "../configs/cloudinary.config.js";

/**
 * @function SignUpController
 * @description Handles user registration by validating request data using Zod schema,
 * checks for existing users in the database, securely hashes the password using bcrypt,
 * saves the new user, and returns a JWT token upon successful registration.
 *
 * @route POST /api/auth/signup
 *
 * @param {Object} req - Express request object
 * @param {Object} req.body - The request body containing user registration data
 * @param {string} req.body.email - User's email address (must be unique)
 * @param {string} req.body.password - User's plain text password to be hashed
 * @param {string} req.body.full_name - Full name of the user
 * @param {string} req.body.profile_picture - URL or base64 encoded string of the user's profile picture
 * @param {string} req.body.bio - Short biography or description of the user
 *
 * @param {Object} res - Express response object
 *
 * @returns {Object} 201 - User account successfully created with token and basic user info
 * @returns {Object} 400 - Input validation failed or user already exists
 * @returns {Object} 500 - Internal server error while creating user
 */

export const SignUpController = async (req, res) => {
  try {
    const parsedData = schemas.signUpSchema.safeParse(req.body);
    if (!parsedData.success) {
      logger.error(`Validation error in SignUpController`, parsedData.error);
      return res.status(400).json({
        message: "Validation error",
        errors: parsedData.error.flatten().fieldErrors,
      });

    }

    const { email, password, full_name, profile_picture, bio } =
      parsedData.data;

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User account already exists with this email",
      });
    }

    const genSalt = await bcrypt.genSalt(Number(process.env.SALT_ROUNDS));
    const hashedPassword = await bcrypt.hash(password, genSalt);

    const newUser = new UserModel({
      email,
      password: hashedPassword,
      full_name,
      profile_picture,
      bio,
      o_auth_provider: "local",
      o_auth_id: "",
    });

    const savedUser = await newUser.save();
    const token = await generateToken(savedUser._id, res);

    logger.info(
      `User account created successfully for ${savedUser.email} [Environment: ${process.env.NODE_ENV}]`
    );

    return res.status(201).json({
      message: "User account created successfully",
      user: {
        _id:savedUser._id,
        email: savedUser.email,
        full_name: savedUser.full_name,
        profile_picture: savedUser.profile_picture,
        bio: savedUser.bio,
      },
      token,
    });
  } catch (error) {
    logger.error(`Error in SignUpController`, error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


export const LoginController = async (req, res) => {
  try {
    const parsedData = schemas.loginSchema.safeParse(req.body);
    if (!parsedData.success) {
      return res.status(400).json({
        message: "Validation error",
        errors: parsedData.error.flatten().fieldErrors,
      });
    }
    const { email, password } = parsedData.data;
    const user = await UserModel.findOne({ email });
    if (!user) {
      logger.warn(`Login failed: No user found for email ${email}`);
      return res.status(400).json({
        message: "Invalid Credentails",
      });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      logger.warn(`Login failed: No user found for email ${email}`);
      return res.status(400).json({
        message: "Invalid Credentials",
      });
    }

    const token = await generateToken(user._id, res);
    logger.info(
      `User ${user.email} logged in successfully [Environment: ${process.env.NODE_ENV}]`
    );
    return res.status(200).json({
      message: "User logged in successfully",
      user: {
        _id:user._id,
        email: user.email,
        full_name: user.full_name,
        profile_picture: user.profile_picture,
        bio: user.bio,
      },
      token,
    });
  } catch (error) {
    logger.error(`Error in LoginController :: `, error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * @function LoginController
 * @description Handles user login by validating input with Zod, verifying the user’s credentials,
 * comparing the password using bcrypt, and generating a JWT token upon successful authentication.
 *
 * @route POST /api/auth/login
 *
 * @param {Object} req - Express request object
 * @param {Object} req.body - The request payload containing login credentials
 * @param {string} req.body.email - User's email address
 * @param {string} req.body.password - User's plain text password
 *
 * @param {Object} res - Express response object
 *
 * @returns {Object} 200 - Login successful with user info and authentication token
 * @returns {Object} 400 - Validation failed or invalid credentials
 * @returns {Object} 500 - Internal server error during login process
 */


export const profileController = async (req, res) => {
  try {
    const { profile_picture } = req.body;
    if (!profile_picture) {
      return res.status(400).json({ message: "Profile picture is required" });
    }

    const uploadResponse = await cloudinary.uploader.upload(profile_picture);
    if (!uploadResponse || !uploadResponse.secure_url) {
      logger.error("Failed to upload profile picture to Cloudinary");
      return res
        .status(500)
        .json({ message: "Failed to upload profile picture" });
    }
    const userId = req.user._id;
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { profile_picture: uploadResponse.secure_url },
      { new: true }
    );

    res.status(200).json({
      user: updatedUser,
      message: "Profile picture updated successfully",
    });

    if (!updatedUser) {
      logger.error(`User not found with ID: ${req.user._id}`);
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    logger.error(`Error in profileController :: `, error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};



export const LogOutContoller = async (req, res) => {
  try {
    res.clearCookie("token");
    // logger.info(
    //   `User logged out successfully [Environment: ${process.env.NODE_ENV}]`
    // );
    return res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    logger.error(`Error in LogOutContoller :: `, error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * @function LogOutController
 * @description Handles user logout by clearing the authentication token cookie.
 *
 * @route POST /api/auth/logout
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 *
 * @returns {Object} 200 - Logout successful with confirmation message
 * @returns {Object} 500 - Internal server error during logout process
 */


export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await UserModel.findById(userId).select("-password");
    if (!user) {
      // logger.error(`User not found with ID: ${userId}`);
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ user });
  } catch (error) {
    logger.error(`Error in getUserProfile :: `, error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


/**
 * @function authenticatedUser
 * @description Verifies and returns the authenticated user's information.
 * Assumes that authentication middleware has already validated the token and attached the user to the request object.
 *
 * @route GET /api/auth/authenticated
 *
 * @param {Object} req - Express request object
 * @param {Object} req.user - Authenticated user object set by middleware
 * @param {Object} res - Express response object
 *
 * @returns {Object} 200 - Authenticated user information
 * @returns {Object} 500 - Internal server error
 */


export const authenticatedUser = async (req, res) => {
  try {
    res.status(200).json({ message: "User is authenticated", user: req.user });
  } catch (error) {
    logger.error(`Error in authenticatedUser :: `, error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

import { Router } from "express";
import {
  LogOutContoller,
  LoginController,
  SignUpController,
  authenticatedUser,
  getUserProfile,
  profileController,
} from "../controllers/auth.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

/**
 * @file auth.route.js
 * @description This file sets up the routing logic for user authentication and profile management
 * within the application. It uses Express Router to modularize routes related to user actions such as:
 * - Signing up a new account
 * - Logging in with credentials
 * - Logging out and clearing auth tokens
 * - Checking if a user is authenticated
 * - Updating user profile information
 * - Fetching the currently logged-in user's profile
 *
 * The `authMiddleware` is applied to protected routes to ensure only authenticated users can access them.
 * All route handlers are defined in `auth.controller.js`.
 *
 * @usage
 * This router should be mounted in the main Express application under a base path like `/api/auth`.
 *
 * @routes
 * POST   /login           → Logs in a user and returns a JWT token
 * POST   /signup          → Registers a new user with validated input
 * POST   /logout          → Logs out the user by clearing the token cookie
 * POST   /update-profile  → Updates user profile data (protected route)
 * GET    /get-user        → Returns user profile data (protected route)
 * GET    /check-auth      → Confirms if a user is authenticated (protected route)
 */


const authRouter = Router();

// Auth routes
authRouter.post("/login" , LoginController);
authRouter.post("/signup" , SignUpController);
authRouter.post("/logout" , LogOutContoller);

// Profile routes
authRouter.put("/update-profile" , authMiddleware, profileController);
authRouter.get("/get-user", authMiddleware, getUserProfile)

// Auth Check 
authRouter.get("/check-auth", authMiddleware, authenticatedUser);

export default authRouter;


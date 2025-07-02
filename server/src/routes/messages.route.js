import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  getMessages,
  getOnlineUsers,
  sendMessage,
} from "../controllers/message.controller.js";

/**
 * @file message.route.js
 * @description Defines routing logic for messaging functionality, including:
 * - Sending a new message
 * - Fetching all messages between two users
 * - Getting the list of online users
 *
 * All routes are protected by `authMiddleware` to ensure only authenticated users can access them.
 * Controllers are defined in `message.controller.js`.
 *
 * @usage
 * Mount this router in the main Express app under a base path like `/api/messages`.
 *
 * @routes
 * GET    /users        → Returns online users excluding the authenticated user
 * GET    /:id          → Fetches messages between authenticated user and user with :id
 * POST   /send/:id     → Sends a message from authenticated user to user with :id
 */


const messageRouter = express.Router();

messageRouter.get("/users", authMiddleware, getOnlineUsers);
messageRouter.get("/:id", authMiddleware, getMessages);
messageRouter.post("/send/:id", authMiddleware, sendMessage);

export default messageRouter;

import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  getMessages,
  getOnlineUsers,
  sendMessage,
} from "../controllers/message.controller.js";

const messageRouter = express.Router();

messageRouter.get("/users", authMiddleware, getOnlineUsers);
messageRouter.get("/:id", authMiddleware, getMessages);
messageRouter.post("/send/:id", authMiddleware, sendMessage);

export default messageRouter;

import MessageModel from "../models/message.model.js";
import UserModel from "../models/user.model.js";
import cloudinary from "../configs/cloudinary.config.js";
import logger from "../utils/logger.js";
import io from "../../server.js";
import { getReceiverSocketId } from "../configs/socket.config.js";

/**
 * @function sendMessage
 * @description Handles sending a message from the authenticated user to a receiver.
 * Uploads image to Cloudinary if provided, saves message to MongoDB, 
 * and emits it via Socket.IO to the receiver.
 *
 * @route POST /api/messages/:id
 *
 * @param {Object} req - Express request object (expects req.user, req.body, req.params)
 * @param {Object} res - Express response object
 *
 * @returns {Object} 200 - Success with message data
 * @returns {Object} 400 - Bad request if parameters missing
 * @returns {Object} 500 - Internal server error
 */


export const sendMessage = async (req, res) => {
  try {
    const receiverId = req.params.id;
    const senderId = req.user._id;
    console.log("sender : " + senderId + " receiverId : " + receiverId);

    const { text, image } = req.body;
    if (!receiverId || !senderId) {
      // Image is not necessary
      logger.warn(
        `Invalid request parameters: receiverId, senderId or text is missing`
      );
      return res.status(400).json({ message: "Bad Request" });
    }

    let imageURL = "";
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image, {
        folder: "chat-app",
      });
      if (!uploadResponse || !uploadResponse.secure_url) {
        logger.error(`Image upload failed for user ID: ${senderId}`);
        return res.status(500).json({ message: "Image upload failed" });
      }
      imageURL = uploadResponse.secure_url;
    }

    const newMessage = new MessageModel({
      senderId,
      receiverId,
      text,
      image: imageURL,
    });

    const savedMessage = await newMessage.save();

    const receiverSocketId = getReceiverSocketId(receiverId);
    io.to(receiverSocketId).emit("newMessage", savedMessage);

    if (!savedMessage) {
      logger.error(`Failed to save message from sender ID: ${senderId}`);
      return res.status(500).json({ message: "Failed to send message" });
    }

    res.status(200).json({
      message: "Message sent successfully",
      data: savedMessage,
    });
  } catch (error) {
    logger.error(`Error in sendMessage Controller: `, error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


/**
 * @function getMessages
 * @description Fetches all chat messages between the authenticated user and another user.
 *
 * @route GET /api/messages/:id
 *
 * @param {Object} req - Express request object (expects req.user, req.params)
 * @param {Object} res - Express response object
 *
 * @returns {Object} 200 - Array of message documents
 * @returns {Object} 500 - Internal server error
 */


export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    const messages = await MessageModel.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    res.status(200).json({ data: messages });
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * @function getOnlineUsers
 * @description Retrieves all users except the authenticated user, 
 * used to show online user list (minus sensitive fields).
 *
 * @route GET /api/users/online
 *
 * @param {Object} req - Express request object (expects req.user)
 * @param {Object} res - Express response object
 *
 * @returns {Object} 200 - Array of user documents
 * @returns {Object} 404 - If no users found
 * @returns {Object} 500 - Internal server error
 */

export const getOnlineUsers = async (req, res) => {
  try {
    const userId = req.user._id;
    const onlineUser = await UserModel.find({ _id: { $ne: userId } })
      .select("-password -__v -createdAt -updatedAt")
      .lean();
    if (!onlineUser) {
      // logger.error(`No online users found for user ID: ${userId}`);
      return res.status(404).json({ message: "No online users found" });
    }
    return res.status(200).json({ data: onlineUser });
  } catch (error) {
    logger.error(`Error in getOnlineUsers Controller: `, error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

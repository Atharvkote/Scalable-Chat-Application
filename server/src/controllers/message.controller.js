import MessageModel from "../models/message.model.js";
import UserModel from "../models/user.model.js";
import cloudinary from "../configs/cloudinary.config.js";
import logger from "../utils/logger.js";
import io from "../../server.js";
import { getReceiverSocketId } from "../configs/socket.config.js";

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

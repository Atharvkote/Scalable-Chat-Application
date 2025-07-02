import "dotenv/config";
import io from "../../server.js";
import { sendToKafka } from "../controllers/kafka.controller.js";
import { socketioLogger } from "../utils/logger.js";
const userSocketMap = {};

/**
 * @file Socket.IO broadcaster
 * @description Sets up Socket.IO server to handle user connections, 
 * message broadcasting, and forwards messages to Kafka.
 *
 * Functions:
 * - getReceiverSocketId(userId): returns socket ID for given user
 * - socketIOBroadcastor(): initializes Socket.IO events for connections and messaging
 *
 * Dependencies:
 * - dotenv for env vars (KAFKA_TOPIC)
 * - socketioLogger for structured logs
 * - sendToKafka() to forward messages to Kafka topic
 */


export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

export const socketIOBroadcastor = async () => {
  io.on("connection", (socket) => {
    if (io) {
      socketioLogger.info("Broadcasting Socket IO Server [ Enviroment : development]");
    }

    
    const userId = socket.handshake.query.userId;
    socketioLogger.info(`A user connected Socket Id : ${socket.id} UserId : ${userId} `);
    // socketioLogger.log(userId)
    if (userId) userSocketMap[userId] = socket.id;

    // io.emit() is used to send events to all the connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
    // socketioLogger.info("Map : " + Object.keys(userSocketMap));

    socket.on("sendMessage", async ({ to, text, image }, callback) => {
      const senderId = userId;
      const message = {
        senderId,
        receiverId: to,
        text,
        image,
        timestamp: Date.now(),
      };

      // Emit to both parties
      const receiverSocketId = userSocketMap[to];
      const senderSocketId = userSocketMap[senderId];

      io.to(receiverSocketId).emit("newMessage", message);
      io.to(senderSocketId).emit("newMessage", message);

      // send to kafka server
      await sendToKafka(process.env.KAFKA_TOPIC, message);

      callback({ status: "ok", message: message });
    });

    socket.on("disconnect", () => {
      socketioLogger.info("A user disconnected", socket.id);
      delete userSocketMap[userId];
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
  });
};

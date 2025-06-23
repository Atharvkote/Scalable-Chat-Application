import io from "../../server.js";
const userSocketMap = {};

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

export const socketIOBroadcastor = () => {
  io.on("connection", (socket) => {
    if (io) {
      console.log("Broadcasting Socket IO");
    }

    console.log("A user connected", socket.id);

    const userId = socket.handshake.query.userId;
    // console.log(userId)
    if (userId) userSocketMap[userId] = socket.id;

    // io.emit() is used to send events to all the connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
    console.log("Map : " + Object.keys(userSocketMap));

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

      // Optional DB save
      
      callback({ status: "ok", message: message });
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected", socket.id);
      delete userSocketMap[userId];
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
  });
};

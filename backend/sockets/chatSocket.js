const Message = require("../models/Message");
const { encrypt, decrypt } = require("../utils/encryption");

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("sendMessage", async (data) => {
      const { fromUserId, toUserId, message } = data;

      const encrypted = encrypt(message);

      const newMsg = await Message.create({
        fromUserId,
        toUserId,
        contentEncrypted: encrypted
      });

      // Send decrypted message to receiver
      io.to(toUserId).emit("receiveMessage", {
        ...newMsg._doc,
        message: decrypt(newMsg.contentEncrypted)
      });
    });

    socket.on("join", (userId) => {
      socket.join(userId);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
};
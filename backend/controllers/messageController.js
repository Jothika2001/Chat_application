const Message = require("../models/Message");
const { encrypt, decrypt } = require("../utils/encryption");

// ✅ Send Message (REST API)
exports.sendMessage = async (req, res) => {
  try {
    const { fromUserId, toUserId, message } = req.body;

    const encrypted = encrypt(message);

    const newMessage = await Message.create({
      fromUserId,
      toUserId,
      contentEncrypted: encrypted
    });

    res.json({
      ...newMessage._doc,
      message // send decrypted to client
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get Messages (Chat History)
exports.getMessages = async (req, res) => {
  try {
    const { user1, user2 } = req.query;

    const messages = await Message.find({
      $or: [
        { fromUserId: user1, toUserId: user2 },
        { fromUserId: user2, toUserId: user1 }
      ]
    }).sort({ createdAt: 1 });

    const decryptedMessages = messages.map(msg => ({
      ...msg._doc,
      message: decrypt(msg.contentEncrypted)
    }));

    res.json(decryptedMessages);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
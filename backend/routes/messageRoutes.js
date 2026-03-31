const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");
const { authMiddleware } = require("../middleware/auth");

router.post("/send", authMiddleware, messageController.sendMessage);
router.get("/chat",authMiddleware, messageController.getMessages);

module.exports = router;
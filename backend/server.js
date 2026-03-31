const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messageRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

const chatSocket = require("./sockets/chatSocket");

const app = express();
const server = http.createServer(app);

const io = socketIo(server, {
  cors: { origin: "*" }
});

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/chatapp")
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => console.error("❌ MongoDB Error:", err.message));

// Debug logs
mongoose.connection.on("connected", () => {
  console.log("📦 Mongoose connected to DB");
});

// Routes
app.get("/", (req, res) => {
  res.send("API Running 🚀");
});

app.use("/users", userRoutes);
app.use("/messages", messageRoutes);
app.use("/payments", paymentRoutes);

// Socket
chatSocket(io);

// Server
server.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});
import express from "express";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] }
});

app.use(cors());
app.use(express.json());

// MongoDB connection — works with local or Atlas via MONGO_URI env
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/chatapp";
mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch(err => {
    console.warn("MongoDB connection failed:", err.message);
    console.warn("Auth endpoints will return errors — make sure MongoDB is running or set MONGO_URI in .env");
  });

app.use("/api/auth", authRoutes);

// ---- Socket.io chat ----
const rooms = {}; // { roomName: [{ socketId, username }] }
const messageHistory = {}; // { roomName: [messages] }

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join", ({ username, room }) => {
    socket.join(room);
    socket.username = username;
    socket.room = room;

    if (!rooms[room]) rooms[room] = [];
    if (!messageHistory[room]) messageHistory[room] = [];

    rooms[room] = rooms[room].filter(u => u.socketId !== socket.id);
    rooms[room].push({ socketId: socket.id, username });

    socket.emit("message_history", messageHistory[room]);
    io.to(room).emit("online_users", rooms[room]);
    socket.to(room).emit("notification", {
      type: "join",
      message: `${username} joined the room`
    });
  });

  socket.on("send_message", ({ message, room }) => {
    const msg = {
      id: Date.now() + Math.random(),
      socketId: socket.id,
      username: socket.username,
      message,
      timestamp: new Date().toISOString()
    };
    if (messageHistory[room]) messageHistory[room].push(msg);
    io.to(room).emit("receive_message", msg);
  });

  socket.on("typing", ({ room, isTyping }) => {
    socket.to(room).emit("user_typing", { username: socket.username, isTyping });
  });

  socket.on("disconnect", () => {
    const room = socket.room;
    if (room && rooms[room]) {
      rooms[room] = rooms[room].filter(u => u.socketId !== socket.id);
      io.to(room).emit("online_users", rooms[room]);
      io.to(room).emit("notification", {
        type: "leave",
        message: `${socket.username} left the room`
      });
    }
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));

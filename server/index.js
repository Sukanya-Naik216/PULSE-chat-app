const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
 
const app = express();
app.use(cors());
 
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});
 
// Store online users: { socketId -> { username, room } }
const onlineUsers = new Map();
 
// Store messages per room
const roomMessages = {};
 
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
 
  // User joins with username and room
  socket.on('join', ({ username, room }) => {
    socket.join(room);
    onlineUsers.set(socket.id, { username, room });
 
    // Send existing messages to the new user
    if (roomMessages[room]) {
      socket.emit('message_history', roomMessages[room]);
    }
 
    // Notify room of new user
    io.to(room).emit('notification', {
      type: 'join',
      message: `${username} joined the room`,
      timestamp: new Date().toISOString(),
    });
 
    // Send updated online users list to room
    emitOnlineUsers(room);
    console.log(`${username} joined room: ${room}`);
  });
 
  // Handle new message
  socket.on('send_message', ({ message, room }) => {
    const user = onlineUsers.get(socket.id);
    if (!user) return;
 
    const msgObj = {
      id: Date.now(),
      username: user.username,
      message,
      room,
      timestamp: new Date().toISOString(),
      socketId: socket.id,
    };
 
    // Store message
    if (!roomMessages[room]) roomMessages[room] = [];
    roomMessages[room].push(msgObj);
    // Keep only last 100 messages per room
    if (roomMessages[room].length > 100) roomMessages[room].shift();
 
    // Broadcast to room
    io.to(room).emit('receive_message', msgObj);
  });
 
  // Typing indicator
  socket.on('typing', ({ room, isTyping }) => {
    const user = onlineUsers.get(socket.id);
    if (!user) return;
    socket.to(room).emit('user_typing', { username: user.username, isTyping });
  });
 
  // Handle disconnect
  socket.on('disconnect', () => {
    const user = onlineUsers.get(socket.id);
    if (user) {
      onlineUsers.delete(socket.id);
      io.to(user.room).emit('notification', {
        type: 'leave',
        message: `${user.username} left the room`,
        timestamp: new Date().toISOString(),
      });
      emitOnlineUsers(user.room);
      console.log(`${user.username} disconnected`);
    }
  });
 
  function emitOnlineUsers(room) {
    const users = [];
    onlineUsers.forEach((value, key) => {
      if (value.room === room) {
        users.push({ socketId: key, username: value.username });
      }
    });
    io.to(room).emit('online_users', users);
  }
});
 
app.get('/', (req, res) => res.json({ message: 'Chat server running!' }));
 
const PORT = 5000;
server.listen(PORT, () => console.log(`Chat server running on port ${PORT}`));
 
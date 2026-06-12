import http from 'http';
import { Server } from 'socket.io';
import app from './app';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// Real-time Chat socket mapping
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // User joins a private chat room
  socket.on('join_room', (chatId: string) => {
    socket.join(chatId);
    console.log(`User ${socket.id} joined room: ${chatId}`);
  });

  // User sends message in the room
  socket.on('send_message', (data: {
    chatId: string;
    senderId: string;
    senderName: string;
    content: string;
    type: 'TEXT' | 'IMAGE' | 'LOCATION';
  }) => {
    console.log(`Message received for room ${data.chatId}: ${data.content}`);
    
    // Broadcast message to everyone in the room (including sender if needed)
    io.to(data.chatId).emit('receive_message', {
      ...data,
      id: 'MSG-' + Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
    });
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

server.listen(PORT, () => {
  console.log(`=============================================`);
  console.log(`🚀 PropertyHub Pakistan Backend is running!`);
  console.log(`📡 Port: ${PORT}`);
  console.log(`🌐 API Endpoint: http://localhost:${PORT}/api/v1`);
  console.log(`=============================================`);
});

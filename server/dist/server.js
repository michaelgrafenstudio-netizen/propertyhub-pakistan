"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const app_1 = __importDefault(require("./app"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const PORT = process.env.PORT || 5000;
const server = http_1.default.createServer(app_1.default);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});
// Real-time Chat socket mapping
io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);
    // User joins a private chat room
    socket.on('join_room', (chatId) => {
        socket.join(chatId);
        console.log(`User ${socket.id} joined room: ${chatId}`);
    });
    // User sends message in the room
    socket.on('send_message', (data) => {
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

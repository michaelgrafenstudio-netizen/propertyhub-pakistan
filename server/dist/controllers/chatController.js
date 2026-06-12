"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessage = exports.getChatMessages = exports.getChats = exports.initiateChat = void 0;
const db_1 = require("../config/db");
const initiateChat = async (req, res) => {
    try {
        const senderId = req.user?.userId;
        const { propertyId } = req.body;
        if (!propertyId) {
            return res.status(400).json({ error: 'Property ID is required.' });
        }
        const property = await db_1.prisma.property.findUnique({ where: { id: propertyId } });
        if (!property) {
            return res.status(404).json({ error: 'Property not found.' });
        }
        const sellerId = property.ownerId;
        if (senderId === sellerId) {
            return res.status(400).json({ error: "You cannot start a chat with yourself." });
        }
        // Check if chat already exists for this property between sender and seller
        let chat = await db_1.prisma.chat.findFirst({
            where: {
                propertyId,
                AND: [
                    { members: { some: { userId: senderId } } },
                    { members: { some: { userId: sellerId } } },
                ],
            },
            include: {
                members: {
                    include: {
                        user: {
                            include: { profile: true },
                        },
                    },
                },
                property: true,
                messages: {
                    orderBy: { createdAt: 'asc' },
                },
            },
        });
        if (!chat) {
            chat = await db_1.prisma.chat.create({
                data: {
                    propertyId,
                    members: {
                        create: [
                            { userId: senderId },
                            { userId: sellerId },
                        ],
                    },
                },
                include: {
                    members: {
                        include: {
                            user: {
                                include: { profile: true },
                            },
                        },
                    },
                    property: true,
                    messages: true,
                },
            });
        }
        res.status(200).json({ chat });
    }
    catch (err) {
        res.status(500).json({ error: err.message || 'Internal server error' });
    }
};
exports.initiateChat = initiateChat;
const getChats = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const chats = await db_1.prisma.chat.findMany({
            where: {
                members: {
                    some: { userId },
                },
            },
            include: {
                property: {
                    include: {
                        images: true,
                    },
                },
                members: {
                    include: {
                        user: {
                            include: { profile: true },
                        },
                    },
                },
                messages: {
                    orderBy: { createdAt: 'desc' },
                    take: 1,
                },
            },
            orderBy: { updatedAt: 'desc' },
        });
        res.status(200).json({ chats });
    }
    catch (err) {
        res.status(500).json({ error: err.message || 'Internal server error' });
    }
};
exports.getChats = getChats;
const getChatMessages = async (req, res) => {
    try {
        const { chatId } = req.params;
        const userId = req.user?.userId;
        // Check membership
        const member = await db_1.prisma.chatMember.findUnique({
            where: {
                chatId_userId: { chatId, userId: userId },
            },
        });
        if (!member) {
            return res.status(403).json({ error: 'Not authorized to access this conversation.' });
        }
        const messages = await db_1.prisma.message.findMany({
            where: { chatId },
            orderBy: { createdAt: 'asc' },
            include: {
                sender: {
                    include: { profile: true },
                },
            },
        });
        res.status(200).json({ messages });
    }
    catch (err) {
        res.status(500).json({ error: err.message || 'Internal server error' });
    }
};
exports.getChatMessages = getChatMessages;
const sendMessage = async (req, res) => {
    try {
        const { chatId } = req.params;
        const senderId = req.user?.userId;
        const { content, type } = req.body;
        if (!content) {
            return res.status(400).json({ error: 'Message content is required.' });
        }
        // Check membership
        const member = await db_1.prisma.chatMember.findUnique({
            where: {
                chatId_userId: { chatId, userId: senderId },
            },
        });
        if (!member) {
            return res.status(403).json({ error: 'Not authorized to send messages to this conversation.' });
        }
        const message = await db_1.prisma.message.create({
            data: {
                chatId,
                senderId: senderId,
                content,
                type: type || 'TEXT',
            },
            include: {
                sender: {
                    include: { profile: true },
                },
            },
        });
        // Update conversation timestamp
        await db_1.prisma.chat.update({
            where: { id: chatId },
            data: { updatedAt: new Date() },
        });
        res.status(201).json({ message });
    }
    catch (err) {
        res.status(500).json({ error: err.message || 'Internal server error' });
    }
};
exports.sendMessage = sendMessage;

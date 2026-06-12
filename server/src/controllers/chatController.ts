import { Response } from 'express';
import { prisma } from '../config/db';
import { AuthRequest } from '../middleware/auth';

export const initiateChat = async (req: AuthRequest, res: Response) => {
  try {
    const senderId = req.user?.userId;
    const { propertyId } = req.body;

    if (!propertyId) {
      return res.status(400).json({ error: 'Property ID is required.' });
    }

    const property = await prisma.property.findUnique({ where: { id: propertyId } });
    if (!property) {
      return res.status(404).json({ error: 'Property not found.' });
    }

    const sellerId = property.ownerId;
    if (senderId === sellerId) {
      return res.status(400).json({ error: "You cannot start a chat with yourself." });
    }

    // Check if chat already exists for this property between sender and seller
    let chat = await prisma.chat.findFirst({
      where: {
        propertyId,
        AND: [
          { members: { some: { userId: senderId! } } },
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
      chat = await prisma.chat.create({
        data: {
          propertyId,
          members: {
            create: [
              { userId: senderId! },
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
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
};

export const getChats = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    const chats = await prisma.chat.findMany({
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
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
};

export const getChatMessages = async (req: AuthRequest, res: Response) => {
  try {
    const { chatId } = req.params;
    const userId = req.user?.userId;

    // Check membership
    const member = await prisma.chatMember.findUnique({
      where: {
        chatId_userId: { chatId, userId: userId! },
      },
    });

    if (!member) {
      return res.status(403).json({ error: 'Not authorized to access this conversation.' });
    }

    const messages = await prisma.message.findMany({
      where: { chatId },
      orderBy: { createdAt: 'asc' },
      include: {
        sender: {
          include: { profile: true },
        },
      },
    });

    res.status(200).json({ messages });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
};

export const sendMessage = async (req: AuthRequest, res: Response) => {
  try {
    const { chatId } = req.params;
    const senderId = req.user?.userId;
    const { content, type } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'Message content is required.' });
    }

    // Check membership
    const member = await prisma.chatMember.findUnique({
      where: {
        chatId_userId: { chatId, userId: senderId! },
      },
    });

    if (!member) {
      return res.status(403).json({ error: 'Not authorized to send messages to this conversation.' });
    }

    const message = await prisma.message.create({
      data: {
        chatId,
        senderId: senderId!,
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
    await prisma.chat.update({
      where: { id: chatId },
      data: { updatedAt: new Date() },
    });

    res.status(201).json({ message });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
};

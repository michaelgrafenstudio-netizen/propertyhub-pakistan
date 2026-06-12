import { Router } from 'express';
import {
  initiateChat,
  getChats,
  getChatMessages,
  sendMessage,
} from '../controllers/chatController';
import { authenticateJWT } from '../middleware/auth';

const router = Router();

router.post('/initiate', authenticateJWT, initiateChat);
router.get('/', authenticateJWT, getChats);
router.get('/:chatId/messages', authenticateJWT, getChatMessages);
router.post('/:chatId/messages', authenticateJWT, sendMessage);

export default router;

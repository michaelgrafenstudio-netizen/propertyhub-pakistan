import { Router } from 'express';
import authRoutes from './authRoutes';
import propertyRoutes from './propertyRoutes';
import chatRoutes from './chatRoutes';
import paymentRoutes from './paymentRoutes';
import adminRoutes from './adminRoutes';
import aiRoutes from './aiRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/properties', propertyRoutes);
router.use('/chats', chatRoutes);
router.use('/payments', paymentRoutes);
router.use('/admin', adminRoutes);
router.use('/ai', aiRoutes);

export default router;

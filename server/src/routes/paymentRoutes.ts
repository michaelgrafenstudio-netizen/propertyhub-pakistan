import { Router } from 'express';
import {
  processPayment,
  createSubscription,
  getSubscriptions,
} from '../controllers/paymentController';
import { authenticateJWT } from '../middleware/auth';

const router = Router();

router.post('/charge', authenticateJWT, processPayment);
router.post('/subscribe', authenticateJWT, createSubscription);
router.get('/subscriptions', authenticateJWT, getSubscriptions);

export default router;

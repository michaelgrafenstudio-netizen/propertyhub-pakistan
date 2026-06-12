import { Router } from 'express';
import {
  estimateValuation,
  generateDescription,
  fraudCheck,
} from '../controllers/aiController';

const router = Router();

router.post('/valuation', estimateValuation);
router.post('/description', generateDescription);
router.post('/fraud-check', fraudCheck);

export default router;

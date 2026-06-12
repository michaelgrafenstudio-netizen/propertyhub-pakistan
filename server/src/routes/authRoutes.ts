import { Router } from 'express';
import {
  register,
  login,
  requestOTP,
  verifyOTP,
  googleSignIn,
  getProfile,
  updateProfile,
  submitVerification,
} from '../controllers/authController';
import { authenticateJWT } from '../middleware/auth';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/otp/request', requestOTP);
router.post('/otp/verify', verifyOTP);
router.post('/google', googleSignIn);

router.get('/profile', authenticateJWT, getProfile);
router.put('/profile', authenticateJWT, updateProfile);
router.post('/profile/verify', authenticateJWT, submitVerification);

export default router;

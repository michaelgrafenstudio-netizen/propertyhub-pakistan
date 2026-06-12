import { Router } from 'express';
import {
  getDashboardStats,
  getPendingListings,
  approveListing,
  getPendingVerifications,
  approveUserVerification,
} from '../controllers/adminController';
import { authenticateJWT, authorizeRoles } from '../middleware/auth';

const router = Router();

// Restrict all these endpoints to ADMIN role only
router.get('/stats', authenticateJWT, authorizeRoles(['ADMIN']), getDashboardStats);
router.get('/properties/pending', authenticateJWT, authorizeRoles(['ADMIN']), getPendingListings);
router.put('/properties/:propertyId/status', authenticateJWT, authorizeRoles(['ADMIN']), approveListing);
router.get('/verifications/pending', authenticateJWT, authorizeRoles(['ADMIN']), getPendingVerifications);
router.put('/verifications/:id/status', authenticateJWT, authorizeRoles(['ADMIN']), approveUserVerification);

export default router;

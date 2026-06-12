import { Router } from 'express';
import {
  createProperty,
  getProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
  toggleFavorite,
  getFavorites,
  getRecommendations,
} from '../controllers/propertyController';
import { authenticateJWT } from '../middleware/auth';

const router = Router();

router.post('/', authenticateJWT, createProperty);
router.get('/', getProperties);
router.get('/favorites', authenticateJWT, getFavorites);
router.get('/recommendations', getRecommendations);
router.get('/:id', getPropertyById);
router.put('/:id', authenticateJWT, updateProperty);
router.delete('/:id', authenticateJWT, deleteProperty);
router.post('/favorite/toggle', authenticateJWT, toggleFavorite);

export default router;

import express from 'express';
import {
  getRoomConcepts,
  getRoomConceptBySlug,
  createRoomConcept,
  updateRoomConcept,
  deleteRoomConcept,
} from '../controllers/roomConceptController.js';
import { protect, authorize, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', optionalAuth, getRoomConcepts);
router.get('/:slug', optionalAuth, getRoomConceptBySlug);
router.post('/', protect, authorize('admin'), createRoomConcept);
router.patch('/:id', protect, authorize('admin'), updateRoomConcept);
router.delete('/:id', protect, authorize('admin'), deleteRoomConcept);

export default router;

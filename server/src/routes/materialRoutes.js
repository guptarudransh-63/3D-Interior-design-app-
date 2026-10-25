import express from 'express';
import {
  getMaterialOptions,
  createMaterialOption,
  updateMaterialOption,
} from '../controllers/materialController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getMaterialOptions);
router.post('/', protect, authorize('admin'), createMaterialOption);
router.patch('/:id', protect, authorize('admin'), updateMaterialOption);

export default router;

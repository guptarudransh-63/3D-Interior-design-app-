import express from 'express';
import {
  getSavedDesigns,
  getSavedDesignById,
  createSavedDesign,
  updateSavedDesign,
  duplicateSavedDesign,
  deleteSavedDesign,
} from '../controllers/savedDesignController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect); // All saved design routes require authentication

router.get('/', getSavedDesigns);
router.post('/', createSavedDesign);
router.get('/:id', getSavedDesignById);
router.patch('/:id', updateSavedDesign);
router.post('/:id/duplicate', duplicateSavedDesign);
router.delete('/:id', deleteSavedDesign);

export default router;

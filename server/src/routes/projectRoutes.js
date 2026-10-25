import express from 'express';
import {
  createProject,
  getProjects,
  getProjectById,
  updateProjectStatus,
  assignDesigner,
} from '../controllers/projectController.js';
import { createInitialProposal } from '../controllers/proposalController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect); // All project routes require authentication

router.post('/', createProject);
router.get('/', getProjects);
router.get('/:id', getProjectById);
router.patch('/:id/status', authorize('designer', 'admin'), updateProjectStatus);
router.patch('/:id/assign', authorize('designer', 'admin'), assignDesigner);

// Nested proposal creation
router.post('/:id/proposals', authorize('designer', 'admin'), createInitialProposal);

export default router;

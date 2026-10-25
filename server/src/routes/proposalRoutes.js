import express from 'express';
import {
  createProposalRevision,
  getProposalVersions,
  submitRevisionRequest,
  acceptProposalVersion,
  declineProposalVersion,
} from '../controllers/proposalController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect); // All proposal routes require authentication

// Versions listing
router.get('/:id/versions', getProposalVersions);

// Create new revision version
router.post('/:id/versions', authorize('designer', 'admin'), createProposalRevision);

// Revision request by client
router.post('/:id/versions/:versionId/revision-requests', submitRevisionRequest);

// Client version acceptance/decline
router.post('/:id/versions/:versionId/accept', acceptProposalVersion);
router.post('/:id/versions/:versionId/decline', declineProposalVersion);

export default router;

import express from 'express';
import { getAdminMetrics, getAllUsers, updateUser } from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect, authorize('admin')); // All admin routes restricted to admin role

router.get('/dashboard', getAdminMetrics);
router.get('/users', getAllUsers);
router.patch('/users/:id', updateUser);

export default router;

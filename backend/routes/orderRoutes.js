import express from 'express';
import { getAdminDashboardStats, addOrderItems, getOrders, updateOrderStatus, deleteOrder, getMyOrders, getAnalyticsStats } from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, addOrderItems);
router.get('/my', protect, getMyOrders);
router.get('/stats', getAdminDashboardStats);
router.get('/analytics', protect, admin, getAnalyticsStats);
router.get('/', protect, admin, getOrders);
router.put('/:id', protect, admin, updateOrderStatus);
router.delete('/:id', protect, admin, deleteOrder);

export default router;

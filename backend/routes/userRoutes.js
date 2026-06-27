import express from 'express';
import { toggleWishlist, getWishlist, getUsers, updateUser, deleteUser, resetUserPassword, updateAdminProfile } from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/wishlist').post(protect, toggleWishlist).get(protect, getWishlist);
router.route('/profile').put(protect, admin, updateAdminProfile);

router.route('/').get(protect, admin, getUsers);
router.route('/:id').put(protect, admin, updateUser).delete(protect, admin, deleteUser);
router.route('/:id/reset-password').post(protect, admin, resetUserPassword);

export default router;

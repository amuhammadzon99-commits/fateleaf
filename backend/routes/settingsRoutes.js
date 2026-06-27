import express from 'express';
import { getSettings, updateSettings, broadcastTelegram } from '../controllers/settingsController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getSettings)
  .put(protect, admin, updateSettings);

router.route('/broadcast-telegram').post(protect, admin, broadcastTelegram);

export default router;

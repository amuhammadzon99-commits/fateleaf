import Settings from '../models/Settings.js';
import { logAudit } from '../utils/auditLogger.js';

// @desc    Get global settings
// @route   GET /api/settings
// @access  Public
export const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update global settings
// @route   PUT /api/settings
// @access  Private/Admin
export const updateSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    let beforeState = null;

    if (!settings) {
      settings = new Settings(req.body);
    } else {
      beforeState = settings.toObject();
      Object.assign(settings, req.body);
    }
    
    const updatedSettings = await settings.save();

    await logAudit(
      req,
      'Изменение настроек',
      'Системные',
      'Обновлены глобальные настройки системы (SEO, логистика, API)',
      { before: beforeState, after: updatedSettings.toObject() }
    );

    res.json(updatedSettings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Broadcast message to all Telegram bot users
// @route   POST /api/settings/broadcast-telegram
// @access  Private/Admin
export const broadcastTelegram = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ message: 'Сообщение не может быть пустым' });
    }

    const { default: bot } = await import('../telegramBot.js');
    const { default: User } = await import('../models/User.js');

    if (!bot) {
      return res.status(500).json({ message: 'Telegram бот не настроен на сервере' });
    }

    // Find all users who have interacted with the bot
    const users = await User.find({ telegramChatId: { $exists: true, $ne: null } });

    let successCount = 0;
    let failCount = 0;

    for (const user of users) {
      if (!user.telegramChatId) continue;
      try {
        await bot.sendMessage(user.telegramChatId, message, { parse_mode: 'Markdown' });
        successCount++;
      } catch (err) {
        console.error(`Failed to send message to ${user.telegramChatId}:`, err.message);
        failCount++;
      }
    }

    await import('../utils/auditLogger.js').then(module => {
      module.logAudit(
        req,
        'Telegram Рассылка',
        'Маркетинг',
        `Отправлена рассылка ${successCount} пользователям. Ошибок: ${failCount}`,
        { message }
      );
    });

    res.json({ message: `Рассылка завершена. Успешно: ${successCount}, Ошибок: ${failCount}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка при отправке рассылки' });
  }
};

import User from '../models/User.js';
import Order from '../models/Order.js';
import { logAudit } from '../utils/auditLogger.js';

// @desc    Toggle product in wishlist
// @route   POST /api/users/wishlist
// @access  Private
export const toggleWishlist = async (req, res) => {
  const { productId } = req.body;
  const user = await User.findById(req.user._id);

  if (user) {
    const isWished = user.wishlist.includes(productId);
    if (isWished) {
      user.wishlist = user.wishlist.filter(id => id.toString() !== productId.toString());
    } else {
      user.wishlist.push(productId);
    }
    await user.save();
    res.json({ wishlist: user.wishlist, message: isWished ? 'Удалено из избранного' : 'Добавлено в избранное' });
  } else {
    res.status(404).json({ message: 'Пользователь не найден' });
  }
};

// @desc    Get user wishlist
// @route   GET /api/users/wishlist
// @access  Private
export const getWishlist = async (req, res) => {
  const user = await User.findById(req.user._id).populate('wishlist');
  if (user) {
    res.json(user.wishlist);
  } else {
    res.status(404).json({ message: 'Пользователь не найден' });
  }
};

// @desc    Get all users (with stats)
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 15;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.role && req.query.role !== 'all') {
      filter.role = req.query.role;
    }

    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      filter.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { phone: searchRegex }
      ];
    }

    const total = await User.countDocuments(filter);
    const users = await User.find(filter)
      .select('-password')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    // Populate order stats for these users
    const userIds = users.map(u => u._id);
    
    const orderStats = await Order.aggregate([
      { $match: { user: { $in: userIds } } },
      { $group: {
          _id: '$user',
          orderCount: { $sum: 1 },
          totalSpent: { $sum: { $cond: [{ $eq: ['$isDelivered', true] }, '$totalPrice', 0] } }
        }
      }
    ]);

    const statsMap = {};
    orderStats.forEach(stat => {
      statsMap[stat._id.toString()] = stat;
    });

    const usersWithStats = users.map(user => {
      const u = user.toObject();
      u.orderCount = statsMap[u._id.toString()]?.orderCount || 0;
      u.totalSpent = statsMap[u._id.toString()]?.totalSpent || 0;
      return u;
    });

    res.json({
      users: usersWithStats,
      page,
      pages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка получения пользователей' });
  }
};

// @desc    Update user (role, tags)
// @route   PUT /api/users/:id
// @access  Private/Admin
export const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (user) {
      const beforeState = user.toObject();
      user.role = req.body.role || user.role;
      if (req.body.tags) user.tags = req.body.tags;
      
      const updatedUser = await user.save();

      let detailsStr = `Обновлен пользователь "${user.name}"`;
      if (beforeState.role !== user.role) {
        detailsStr = `Изменена роль пользователя "${user.name}" с ${beforeState.role} на ${user.role}`;
      }

      await logAudit(
        req,
        'Изменение пользователя',
        'Пользователи',
        detailsStr,
        { before: beforeState, after: updatedUser.toObject() }
      );

      res.json(updatedUser);
    } else {
      res.status(404).json({ message: 'Пользователь не найден' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Ошибка обновления пользователя' });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      await User.deleteOne({ _id: user._id });
      res.json({ message: 'Пользователь удален' });
    } else {
      res.status(404).json({ message: 'Пользователь не найден' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Ошибка удаления пользователя' });
  }
};

// @desc    Reset user password
// @route   POST /api/users/:id/reset-password
// @access  Private/Admin
export const resetUserPassword = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      const tempPassword = Math.random().toString(36).slice(-8); // Generate 8 char password
      user.password = tempPassword;
      await user.save();
      res.json({ message: 'Пароль успешно сброшен', tempPassword });
    } else {
      res.status(404).json({ message: 'Пользователь не найден' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сброса пароля' });
  }
};

// @desc    Update admin profile
// @route   PUT /api/users/profile
// @access  Private/Admin
export const updateAdminProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      
      if (req.body.newPassword) {
        if (!req.body.oldPassword) {
          return res.status(400).json({ message: 'Необходимо ввести старый пароль для изменения' });
        }
        
        const isMatch = await user.matchPassword(req.body.oldPassword);
        if (!isMatch) {
          return res.status(401).json({ message: 'Неверный старый пароль' });
        }
        
        user.password = req.body.newPassword;
      }
      
      const updatedUser = await user.save();
      
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        token: req.headers.authorization ? req.headers.authorization.split(' ')[1] : ''
      });
    } else {
      res.status(404).json({ message: 'Пользователь не найден' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


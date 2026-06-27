import AuditLog from '../models/AuditLog.js';
import User from '../models/User.js';

// @desc    Get audit logs
// @route   GET /api/audit
// @access  Private/Admin
export const getAuditLogs = async (req, res) => {
  try {
    const page = Number(req.query.pageNumber) || 1;
    const limit = 50;

    const filter = {};

    // Filter by Category
    if (req.query.category && req.query.category !== 'Все') {
      filter.category = req.query.category;
    }

    // Filter by User (Admin) name or exact Action string
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      const matchingUsers = await User.find({ name: searchRegex }).select('_id');
      const userIds = matchingUsers.map(u => u._id);
      
      filter.$or = [
        { admin: { $in: userIds } },
        { action: searchRegex },
        { details: searchRegex }
      ];
    }

    // Filter by Date Range
    if (req.query.startDate || req.query.endDate) {
      filter.createdAt = {};
      if (req.query.startDate) {
        filter.createdAt.$gte = new Date(req.query.startDate);
      }
      if (req.query.endDate) {
        // Include the entire end date by adding 1 day
        const end = new Date(req.query.endDate);
        end.setDate(end.getDate() + 1);
        filter.createdAt.$lt = end;
      }
    }

    const count = await AuditLog.countDocuments(filter);

    const logs = await AuditLog.find(filter)
      .populate('admin', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(limit * (page - 1));

    res.json({ logs, page, pages: Math.ceil(count / limit), total: count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

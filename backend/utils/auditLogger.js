import AuditLog from '../models/AuditLog.js';

/**
 * Standardized function to create audit logs
 * 
 * @param {Object} req - The Express request object (used to extract user ID and IP address)
 * @param {String} action - Short title of the action (e.g., 'Создан товар', 'Изменен статус заказа')
 * @param {String} category - One of: 'Товары', 'Заказы', 'Системные', 'Пользователи', 'Другое'
 * @param {String} details - Human readable string explaining exactly what happened
 * @param {Object} metadata - (Optional) JSON object storing previous and new states, e.g. { before: {...}, after: {...} }
 */
export const logAudit = async (req, action, category, details, metadata = null) => {
  try {
    if (!req.user || !req.user._id) return;

    // Try to get IP address from request
    const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress || null;

    const auditEntry = new AuditLog({
      admin: req.user._id,
      action,
      category,
      details,
      ipAddress,
      metadata
    });

    await auditEntry.save();
  } catch (error) {
    console.error('Audit Log Error:', error);
  }
};

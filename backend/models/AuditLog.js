import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true },
  details: { type: String, required: true },
  category: { 
    type: String, 
    required: true,
    enum: ['Товары', 'Заказы', 'Системные', 'Пользователи', 'Другое'],
    default: 'Другое'
  },
  ipAddress: { type: String },
  metadata: { type: mongoose.Schema.Types.Mixed } // To store JSON representing Before/After state or other details
}, { timestamps: true });

export default mongoose.model('AuditLog', auditLogSchema);

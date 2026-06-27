import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true },
  discountType: { type: String, enum: ['percent', 'fixed'], required: true },
  discountValue: { type: Number, required: true },
  expiresAt: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
  usageCount: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('Coupon', couponSchema);

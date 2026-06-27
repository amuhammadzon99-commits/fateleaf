import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderItems: [
    {
      name: { type: String, required: true },
      qty: { type: Number, required: true },
      image: { type: String, required: true },
      price: { type: Number, required: true },
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: false },
      isGiftBox: { type: Boolean, default: false },
    }
  ],
  shippingAddress: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
  },
  paymentMethod: { type: String, required: true },
  paymentResult: {
    id: { type: String },
    status: { type: String },
    update_time: { type: String },
    email_address: { type: String },
  },
  totalPrice: { type: Number, required: true, default: 0.0 },
  isPaid: { type: Boolean, required: true, default: false },
  paidAt: { type: Date },
  isDelivered: { type: Boolean, required: true, default: false },
  deliveredAt: { type: Date },
  isCancelled: { type: Boolean, required: true, default: false },
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);

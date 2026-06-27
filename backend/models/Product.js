import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
  image: { type: String }, // User uploaded photo
}, { timestamps: true });

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  images: [{ type: String }],
  category: { type: String, required: true },
  oldPrice: { type: Number },
  weight: { type: String, default: '50g' },
  badge: { type: String, enum: ['new', 'sale', 'hit', 'none'], default: 'none' },
  stock: { type: Number, required: true, default: 0 },
  reviews: [reviewSchema],
  rating: { type: Number, required: true, default: 0 },
  numReviews: { type: Number, required: true, default: 0 },
}, { timestamps: true });

export default mongoose.model('Product', productSchema);

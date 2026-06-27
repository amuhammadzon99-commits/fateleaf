import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  // Store Config
  deliveryCost: { type: Number, default: 0 },
  freeDeliveryThreshold: { type: Number, default: 3000 },
  supportPhone: { type: String, default: '+998 (91) 009-82-52' },
  workHours: { type: String, default: 'Ежедневно с 09:00 до 21:00' },
  maintenanceMode: { type: Boolean, default: false },

  // Integrations
  telegramBotToken: { type: String, default: '' },
  telegramChatId: { type: String, default: '' },
  paymentGatewayMode: { type: String, enum: ['test', 'live'], default: 'test' },
  paymentGatewayPublicKey: { type: String, default: '' },
  paymentGatewaySecretKey: { type: String, default: '' },

  // Marketing (Global)
  globalDiscountActive: { type: Boolean, default: false },
  globalDiscountPercent: { type: Number, default: 0 },
  globalDiscountDescription: { type: String, default: '' },

  // SEO
  metaTitle: { type: String, default: 'FateLeaf - Элитный чайный магазин' },
  metaDescription: { type: String, default: 'Магазин премиального чая и аксессуаров. Лучшие сорта со всего мира.' },
  analyticsPixelId: { type: String, default: '' },

  // Logistics & Localization
  deliveryZones: [{
    name: { type: String, required: true },
    cost: { type: Number, required: true }
  }],
  currencies: [{
    code: { type: String, required: true },
    rate: { type: Number, required: true },
    symbol: { type: String, required: true }
  }],
  baseCurrency: { type: String, default: 'RUB' }
}, { timestamps: true });

export default mongoose.model('Settings', settingsSchema);

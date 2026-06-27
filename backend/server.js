import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

// Load env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

import { MongoMemoryServer } from 'mongodb-memory-server';

import User from './models/User.js';
import Product from './models/Product.js';
import bcrypt from 'bcryptjs';

const seedDatabase = async () => {
  try {
    const admin = await User.findOne({ email: 'amuhammadzon99@gmail.com' });
    if (!admin) {
      await User.create({
        name: 'Мухаммаджон',
        email: 'amuhammadzon99@gmail.com',
        password: 'Gojo_Satoro777',
        role: 'admin'
      });
      console.log('Авто-создание: Админ создан');
    } else {
      admin.password = 'Gojo_Satoro777';
      admin.role = 'admin';
      await admin.save();
      console.log('Авто-создание: Пароль и роль админа проверены/обновлены');
    }

    const count = await Product.countDocuments();
    if (count === 0) {
      const fs = await import('fs');
      const path = await import('path');
      const dataPath = path.join(process.cwd(), 'products_data.txt');
      if (fs.existsSync(dataPath)) {
        const fileContent = fs.readFileSync(dataPath, 'utf-8');
        const products = [];
        let currentProduct = null;
        let currentCategory = 'Зеленый чай';
        
        const lines = fileContent.split('\n');
        for (const line of lines) {
          const text = line.trim();
          if (text.startsWith('🟢 Категория:') || text.startsWith('🟤 Категория:') || text.startsWith('🔵 Категория:') || text.startsWith('🌸 Категория:') || text.startsWith('🛠 Категория:') || text.startsWith('🎁 Категория:') || text.startsWith('🟡 Категория:')) {
             const match = text.match(/Категория:\s*(.*?)\s*\(/);
             if (match) currentCategory = match[1].trim();
          }
          if (/^\d+$/.test(text)) {
            if (currentProduct && currentProduct.name && currentProduct.category && currentProduct.description) {
              products.push(currentProduct);
            }
            currentProduct = { category: currentCategory };
            continue;
          }
          if (!currentProduct) continue;
          if (text.startsWith('Название товара:')) currentProduct.name = text.replace('Название товара:', '').trim();
          else if (text.startsWith('Цена (₽):')) currentProduct.price = Number(text.replace('Цена (₽):', '').trim());
          else if (text.startsWith('Количество на складе:')) currentProduct.stock = Number(text.replace('Количество на складе:', '').trim());
          else if (text.startsWith('Категория (ID/Имя):')) currentProduct.category = text.replace('Категория (ID/Имя):', '').trim();
          else if (text.startsWith('Старая цена (₽):')) {
            currentProduct.oldPrice = Number(text.replace('Старая цена (₽):', '').trim());
            if (currentProduct.oldPrice === 0) delete currentProduct.oldPrice;
          }
          else if (text.startsWith('Вес/Объем:')) currentProduct.weight = text.replace('Вес/Объем:', '').trim();
          else if (text.startsWith('Бейджик:')) {
            const badgeRu = text.replace('Бейджик:', '').trim().toLowerCase();
            let badge = 'none';
            if (badgeRu.includes('хит')) badge = 'hit';
            else if (badgeRu.includes('новинка')) badge = 'new';
            else if (badgeRu.includes('скидка')) badge = 'sale';
            currentProduct.badge = badge;
          }
          else if (text.startsWith('Описание:')) currentProduct.description = text.replace('Описание:', '').trim();
        }
        if (currentProduct && currentProduct.name) {
          if (!currentProduct.description) currentProduct.description = currentProduct.name;
          if (!currentProduct.category) currentProduct.category = 'Без категории';
          products.push(currentProduct);
        }
        await Product.insertMany(products);
        console.log(`Авто-создание: Добавлено ${products.length} товаров из products_data.txt`);
      } else {
        await Product.insertMany([
          {
            name: 'Mystic Matcha', price: 1200, oldPrice: 1500, weight: '50g',
            category: 'Японский чай', description: 'Премиальная церемониальная матча с мягким умами вкусом.',
            stock: 50, badge: 'hit', images: ['/uploads/1.png']
          }
        ]);
        console.log('Авто-создание: Добавлены дефолтные товары');
      }
    }
  } catch (err) {
    console.error('Ошибка авто-восстановления:', err);
  }
};

// Database connection
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB connected (Local/Cloud)');
    await seedDatabase();
  })
  .catch(async (err) => {
    console.error('Local MongoDB connection failed. Starting Persistent Local Database...');
    try {
      const fs = await import('fs');
      const path = await import('path');
      const dbPath = path.join(process.cwd(), 'mongodb-data');
      if (!fs.existsSync(dbPath)) {
        fs.mkdirSync(dbPath, { recursive: true });
      }
      const mongoServer = await MongoMemoryServer.create({
        instance: {
          dbPath: dbPath,
          storageEngine: 'wiredTiger'
        }
      });
      const inMemoryUri = mongoServer.getUri();
      await mongoose.connect(inMemoryUri, { dbName: 'fateleaf' });
      console.log('Persistent Local MongoDB connected successfully! Data is saved in ' + dbPath);
      await seedDatabase();
    } catch (e) {
      console.error('Persistent Local MongoDB also failed:', e);
    }
  });

import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import couponRoutes from './routes/couponRoutes.js';
import auditRoutes from './routes/auditRoutes.js';
import subscriberRoutes from './routes/subscriberRoutes.js';
import path from 'path';

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/upload', uploadRoutes);

// Инициализация Telegram Бота
import './telegramBot.js';

const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

app.use('/api/orders', orderRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/subscribe', subscriberRoutes);
// app.use('/api/ai', aiRoutes);


app.get('/', (req, res) => {
  res.send('FateLeaf API is running...');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

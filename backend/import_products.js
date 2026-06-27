import fs from 'fs';
import mongoose from 'mongoose';
import path from 'path';
import { MongoMemoryServer } from 'mongodb-memory-server';

import Product from './models/Product.js';

const __dirname = path.resolve();

async function run() {
  try {
    const dataPath = path.join(__dirname, 'products_data.txt');
    const fileContent = fs.readFileSync(dataPath, 'utf-8');

    // 2. Parse products
    const products = [];
    let currentProduct = null;
    let currentCategory = 'Зеленый чай'; // Default category
    
    const lines = fileContent.split('\n');
    for (const line of lines) {
      const text = line.trim();
      
      if (text.startsWith('🟢 Категория:') || text.startsWith('🟤 Категория:') || text.startsWith('🔵 Категория:') || text.startsWith('🌸 Категория:') || text.startsWith('🛠 Категория:') || text.startsWith('🎁 Категория:') || text.startsWith('🟡 Категория:')) {
         // extract text after "Категория: " and before "(ID/Имя:"
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
      
      if (text.startsWith('Название товара:')) {
        currentProduct.name = text.replace('Название товара:', '').trim();
      } else if (text.startsWith('Цена (₽):')) {
        currentProduct.price = Number(text.replace('Цена (₽):', '').trim());
      } else if (text.startsWith('Количество на складе:')) {
        currentProduct.stock = Number(text.replace('Количество на складе:', '').trim());
      } else if (text.startsWith('Категория (ID/Имя):')) {
        currentProduct.category = text.replace('Категория (ID/Имя):', '').trim();
      } else if (text.startsWith('Старая цена (₽):')) {
        currentProduct.oldPrice = Number(text.replace('Старая цена (₽):', '').trim());
        if (currentProduct.oldPrice === 0) delete currentProduct.oldPrice;
      } else if (text.startsWith('Вес/Объем:')) {
        currentProduct.weight = text.replace('Вес/Объем:', '').trim();
      } else if (text.startsWith('Бейджик:')) {
        const badgeRu = text.replace('Бейджик:', '').trim().toLowerCase();
        let badge = 'none';
        if (badgeRu.includes('хит')) badge = 'hit';
        else if (badgeRu.includes('новинка')) badge = 'new';
        else if (badgeRu.includes('скидка')) badge = 'sale';
        currentProduct.badge = badge;
      } else if (text.startsWith('Описание:')) {
        currentProduct.description = text.replace('Описание:', '').trim();
      } else if (text.startsWith('Изображение:')) {
         // User requested no photo. We leave images array empty or placeholder
      }
    }
    
    // push the last one if it was incomplete in the prompt but has required fields
    if (currentProduct && currentProduct.name) {
      if (!currentProduct.description) currentProduct.description = currentProduct.name;
      if (!currentProduct.category) currentProduct.category = 'Без категории';
      products.push(currentProduct);
    }
    
    console.log(`Parsed ${products.length} products.`);

    // 3. Connect to database
    let dbConnected = false;
    try {
      await mongoose.connect('mongodb://localhost:27017/fateleaf', { serverSelectionTimeoutMS: 2000 });
      dbConnected = true;
      console.log('Connected to local MongoDB');
    } catch (e) {
      console.log('Local MongoDB failed, starting persistent in-memory db...');
      const dbPath = path.join(process.cwd(), 'mongodb-data');
      if (!fs.existsSync(dbPath)) fs.mkdirSync(dbPath, { recursive: true });
      const mongoServer = await MongoMemoryServer.create({
        instance: { dbPath: dbPath, storageEngine: 'wiredTiger' }
      });
      await mongoose.connect(mongoServer.getUri(), { dbName: 'fateleaf' });
      dbConnected = true;
      console.log('Connected to Persistent MongoMemoryServer');
    }
    
    if (!dbConnected) return;
    
    // 4. Insert products
    await Product.insertMany(products);
    console.log('Successfully inserted all products!');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

run();

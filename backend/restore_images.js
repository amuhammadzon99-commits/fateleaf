import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { MongoMemoryServer } from 'mongodb-memory-server';

dotenv.config();

const productSchema = new mongoose.Schema({}, { strict: false });
const Product = mongoose.model('Product', productSchema, 'products');

async function run() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to normal DB');
  } catch (err) {
    console.log('Fallback to MongoMemoryServer...');
    const dbPath = path.join(process.cwd(), 'mongodb-data');
    const mongoServer = await MongoMemoryServer.create({
      instance: { dbPath: dbPath, storageEngine: 'wiredTiger' }
    });
    const inMemoryUri = mongoServer.getUri();
    await mongoose.connect(inMemoryUri, { dbName: 'fateleaf' });
    console.log('Connected to fallback DB');
  }

  // products is sorted by insertion order
  const products = await Product.find({}).sort({ _id: 1 });
  
  const uploadsDir = path.join(process.cwd(), 'uploads');
  if (fs.existsSync(uploadsDir)) {
    let files = fs.readdirSync(uploadsDir);
    files = files.filter(f => f.startsWith('photo_') && f.endsWith('.jpg')).sort();
    
    let imgIndex = 0;
    for (let product of products) {
      if (!product.images || product.images.length === 0 || product.images[0].includes('placeholder')) {
        if (imgIndex < files.length) {
           product.images = [`/uploads/${files[imgIndex]}`];
           imgIndex++;
           await Product.updateOne({ _id: product._id }, { $set: { images: product.images } });
           console.log(`Updated ${product.name} with ${product.images[0]}`);
        }
      } else {
        console.log(`${product.name} already has image: ${product.images[0]}`);
      }
    }
    console.log('Finished restoring images.');
  } else {
    console.log('No uploads dir.');
  }

  process.exit(0);
}
run();

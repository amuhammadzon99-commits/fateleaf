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

  const products = await Product.find({}).lean();
  const output = products.map(p => `${p.name}: ${p.images && p.images.length ? p.images.join(', ') : 'no images'}`).join('\n');
  fs.writeFileSync('db_output.txt', output);
  process.exit(0);
}
run();

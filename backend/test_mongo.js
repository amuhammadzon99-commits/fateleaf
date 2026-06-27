import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import path from 'path';
import fs from 'fs';

const __dirname = path.resolve();

async function test() {
  try {
    const dbPath = path.join(__dirname, 'test-mongodb-data');
    if (!fs.existsSync(dbPath)) {
      fs.mkdirSync(dbPath, { recursive: true });
    }
    const mongoServer = await MongoMemoryServer.create({
      instance: {
        dbPath: dbPath,
        storageEngine: 'wiredTiger'
      }
    });
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
    console.log("Connected to in-memory server with dbPath:", dbPath);

    const Cat = mongoose.model('Cat', { name: String });
    const count = await Cat.countDocuments();
    console.log("Current cat count:", count);
    
    if (count === 0) {
      const kitty = new Cat({ name: 'Zildjian' });
      await kitty.save();
      console.log('Saved cat');
    }
    
    await mongoose.disconnect();
    await mongoServer.stop();
  } catch(e) {
    console.error(e);
  }
}

test();

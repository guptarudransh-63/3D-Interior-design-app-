import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import { safeSeedCatalog } from '../services/catalogSeeder.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

const run = async () => {
  try {
    console.log('[Safe Seed Script]: Connecting to MongoDB...');
    await connectDB();
    console.log('[Safe Seed Script]: Connected. Ensuring default room concepts and materials...');
    const result = await safeSeedCatalog();
    console.log(`[Safe Seed Script]: Complete. Ensured ${result.count} concepts.`);
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('[Safe Seed Script Error]:', error.message);
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
};

run();

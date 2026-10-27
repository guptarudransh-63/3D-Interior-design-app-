import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import app from './app.js';
import { connectDB } from './config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from server directory first, fallback to root .env
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config();

const PORT = process.env.PORT || 5001;
const HOST = '0.0.0.0';

let isConnecting = false;

// Attempt database connection with retry on failure
const attemptDBConnection = async () => {
  if (mongoose.connection.readyState === 1 || isConnecting) {
    return;
  }

  isConnecting = true;
  try {
    await connectDB();
    console.log('[Database Status]: MongoDB connection established and ready for requests.');
  } catch (error) {
    console.error(`[Database Connection Notice]: ${error.message}`);
    console.log('[Database Status]: Server is actively listening. Will retry database connection in 10s...');
    setTimeout(attemptDBConnection, 10000);
  } finally {
    isConnecting = false;
  }
};

// Start Express server and initiate database connection
const startServer = async () => {
  const server = app.listen(PORT, HOST, () => {
    console.log(`[SpaceCraft Server Running]: http://${HOST}:${PORT}`);
    console.log(`[Environment]: ${process.env.NODE_ENV || (process.env.RENDER ? 'production' : 'development')}`);
  });

  server.on('error', (err) => {
    console.error(`[Server Listen Error]: ${err.message}`);
    process.exit(1);
  });

  // Initiate database connection
  attemptDBConnection();

  return server;
};

startServer();

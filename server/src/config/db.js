import mongoose from 'mongoose';

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

let lastConnectionError = null;

export const getLastDbError = () => lastConnectionError;

/**
 * Returns the resolved MongoDB connection URI or throws in production if missing.
 * Prevents silent fallback to 127.0.0.1 in production environments like Render.
 */
export const getMongoUri = () => {
  const envUri =
    process.env.MONGODB_URI ||
    process.env.MONGO_URI ||
    process.env.DATABASE_URL;

  if (envUri && envUri.trim()) {
    return envUri.trim();
  }

  const isCloudHost =
    process.env.NODE_ENV === 'production' ||
    Boolean(process.env.RENDER) ||
    Boolean(process.env.VERCEL) ||
    Boolean(process.env.RENDER_SERVICE_ID);

  if (isCloudHost) {
    const errorMsg =
      '[MongoDB Configuration Error]: MONGODB_URI environment variable is missing on Render! ' +
      'Please add MONGODB_URI in your Render Dashboard (Environment tab) with your MongoDB Atlas connection string ' +
      '(e.g., mongodb+srv://<username>:<password>@cluster0.mongodb.net/spacecraft?retryWrites=true&w=majority). ' +
      'Silently falling back to localhost (127.0.0.1:27017) is blocked on Render.';
    console.error(errorMsg);
    throw new Error(errorMsg);
  }

  // Local development fallback only
  const localFallback = 'mongodb://127.0.0.1:27017/spacecraft';
  console.log(
    `[MongoDB Notice]: MONGODB_URI not set. Using local development fallback: ${localFallback}`
  );
  return localFallback;
};

/**
 * Connects to MongoDB with connection reuse, server selection timeout, and event logging.
 */
export const connectDB = async () => {
  if (cached.conn && mongoose.connection.readyState === 1) {
    lastConnectionError = null;
    return cached.conn;
  }

  // Reset cached pointers if connection is completely closed
  if (mongoose.connection.readyState === 0) {
    cached.conn = null;
    cached.promise = null;
  }

  const mongoUri = getMongoUri();

  // Attach lifecycle event handlers once
  if (!mongoose.connection.listeners('disconnected').length) {
    mongoose.connection.on('disconnected', () => {
      console.warn('[MongoDB Disconnected]: Lost connection to database.');
      cached.conn = null;
      cached.promise = null;
      lastConnectionError = 'Connection dropped by server or network.';
    });

    mongoose.connection.on('reconnected', () => {
      console.log('[MongoDB Reconnected]: Database connection re-established.');
      lastConnectionError = null;
    });

    mongoose.connection.on('error', (err) => {
      console.error(`[MongoDB Runtime Error]: ${err.message}`);
      lastConnectionError = err.message;
    });
  }

  if (!cached.promise) {
    const opts = {
      serverSelectionTimeoutMS: 5000,
    };

    cached.promise = mongoose.connect(mongoUri, opts).then((mongooseInstance) => {
      // Log host safely without exposing username/password
      console.log(`[MongoDB Connected]: ${mongooseInstance.connection.host}`);
      lastConnectionError = null;
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
    lastConnectionError = null;
    return cached.conn;
  } catch (error) {
    cached.conn = null;
    cached.promise = null;
    lastConnectionError = error.message;
    console.error(`[MongoDB Connection Error]: ${error.message}`);
    throw error;
  }
};

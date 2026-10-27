import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import { errorHandler } from './middleware/errorHandler.js';
import { connectDB, getLastDbError } from './config/db.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import materialRoutes from './routes/materialRoutes.js';
import roomConceptRoutes from './routes/roomConceptRoutes.js';
import savedDesignRoutes from './routes/savedDesignRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import proposalRoutes from './routes/proposalRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from server directory first, then fallback to root
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config();

const app = express();

// Middleware
const configuredOrigins = (process.env.CLIENT_URL || '')
  .split(',')
  .map((url) => url.trim().replace(/\/+$/, ''))
  .filter(Boolean);

const defaultLocalOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
];

const isAllowedOrigin = (origin) => {
  if (!origin) return true; // Server-to-server, curl, mobile, health checks
  if (configuredOrigins.includes(origin) || configuredOrigins.includes('*')) return true;
  if (defaultLocalOrigins.includes(origin)) return true;
  // Automatically allow any Vercel deployment (*.vercel.app)
  if (/^https:\/\/([a-zA-Z0-9_-]+\.)*vercel\.app$/.test(origin)) return true;
  // Automatically allow localhost with any port
  if (/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) return true;
  // Permissive fallback so legitimate client domains are never blocked by edge CORS policy
  return true;
};

const corsOptions = {
  origin: (origin, callback) => {
    callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  exposedHeaders: ['Set-Cookie'],
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Root endpoint for platform ping & browser check
app.get('/', (req, res) => {
  const dbStates = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  const hasUri = Boolean(
    process.env.MONGODB_URI || process.env.MONGO_URI || process.env.DATABASE_URL
  );

  res.json({
    name: 'SpaceCraft 3D Interior Design API',
    status: 'online',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      catalog: '/api/room-concepts',
      materials: '/api/material-options',
    },
    database: {
      status: dbStates[mongoose.connection.readyState] || 'disconnected',
      readyState: mongoose.connection.readyState,
      uriConfigured: hasUri,
      connectedHost: mongoose.connection.host || null,
      lastError: getLastDbError() || null,
    },
    timestamp: new Date().toISOString(),
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  const dbStates = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  const hasUri = Boolean(
    process.env.MONGODB_URI || process.env.MONGO_URI || process.env.DATABASE_URL
  );

  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'SpaceCraft API',
    version: '1.0.0',
    environment: process.env.NODE_ENV || (process.env.RENDER ? 'production' : 'development'),
    database: {
      status: dbStates[mongoose.connection.readyState] || 'disconnected',
      readyState: mongoose.connection.readyState,
      uriConfigured: hasUri,
      connectedHost: mongoose.connection.host || null,
      lastError: getLastDbError() || null,
    },
  });
});

// Database connection guard with automatic on-demand connection
const requireDB = async (req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next();
  }

  // 1. If already connected, proceed immediately
  if (mongoose.connection.readyState === 1) {
    return next();
  }

  // 2. If connecting or disconnected, attempt to establish/wait for connection
  try {
    console.log(`[Database Guard]: Mongoose state is ${mongoose.connection.readyState}. Attempting connection for ${req.method} ${req.originalUrl}...`);
    await connectDB();
    if (mongoose.connection.readyState === 1) {
      return next();
    }
  } catch (err) {
    console.error(`[Database Guard]: Connection attempt failed for ${req.originalUrl}:`, err.message);
  }

  // 3. If still not ready, return clean 503 with specific diagnostics
  const lastErr = getLastDbError();
  const hasUri = Boolean(
    process.env.MONGODB_URI || process.env.MONGO_URI || process.env.DATABASE_URL
  );

  return res.status(503).json({
    success: false,
    message:
      'Database is currently unavailable. Please verify MONGODB_URI is set in your Render environment variables and MongoDB Atlas allows incoming connections.',
    code: 'DATABASE_UNAVAILABLE',
    details: {
      readyState: mongoose.connection.readyState,
      uriConfigured: hasUri,
      reason: lastErr || 'Connection could not be established',
    },
  });
};

// API Routes
app.use('/api/auth', requireDB, authRoutes);
app.use('/api/material-options', requireDB, materialRoutes);
app.use('/api/room-concepts', requireDB, roomConceptRoutes);
app.use('/api/designs', requireDB, savedDesignRoutes);
app.use('/api/projects', requireDB, projectRoutes);
app.use('/api/proposals', requireDB, proposalRoutes);
app.use('/api/admin', requireDB, adminRoutes);

// 404 Handler for undefined API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API route not found: ${req.originalUrl}`,
  });
});

// Central Error Handler
app.use(errorHandler);

export default app;

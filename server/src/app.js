import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import { errorHandler } from './middleware/errorHandler.js';

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
  if (configuredOrigins.includes(origin)) return true;
  if (defaultLocalOrigins.includes(origin)) return true;
  // Automatically allow any Vercel production or preview deployment URL
  if (/^https:\/\/([a-zA-Z0-9_-]+\.)*vercel\.app$/.test(origin)) return true;
  // Permissive fallback in non-production
  if (process.env.NODE_ENV !== 'production') return true;
  return false;
};

app.use(
  cors({
    origin: (origin, callback) => {
      if (isAllowedOrigin(origin)) {
        callback(null, true);
      } else {
        console.warn(`[CORS Blocked]: Origin ${origin} not in allowed list.`);
        callback(new Error(`CORS policy does not allow access from origin: ${origin}`));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  const dbStates = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'SpaceCraft API',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    database: dbStates[mongoose.connection.readyState] || 'disconnected',
  });
});

// Database connection guard for database-dependent routes
const requireDB = (req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next();
  }

  // readyState: 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  if (mongoose.connection.readyState === 0) {
    return res.status(503).json({
      success: false,
      message:
        'Database is currently unavailable. Please verify MONGODB_URI is set in your Render environment variables and MongoDB Atlas allows incoming connections.',
      code: 'DATABASE_UNAVAILABLE',
      database: 'disconnected',
    });
  }

  next();
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

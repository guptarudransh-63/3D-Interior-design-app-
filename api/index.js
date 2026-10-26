import app from '../server/src/app.js';
import { connectDB } from '../server/src/config/db.js';

export default async function handler(req, res) {
  // Normalize req.url to ensure /api prefix is preserved for Express route matching
  if (req.url && !req.url.startsWith('/api')) {
    req.url = '/api' + (req.url.startsWith('/') ? req.url : '/' + req.url);
  }

  // Connect to MongoDB if MONGODB_URI is configured
  if (process.env.MONGODB_URI) {
    try {
      await connectDB();
    } catch (dbErr) {
      console.error('[Vercel DB Connection Warning]:', dbErr.message);
    }
  }

  return app(req, res);
}

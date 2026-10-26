import dotenv from 'dotenv';
import app from './app.js';
import { connectDB } from './config/db.js';

dotenv.config();

const PORT = process.env.PORT || 5001;
const HOST = '0.0.0.0';

// Connect to Database and start server
const startServer = async () => {
  const server = app.listen(PORT, HOST, () => {
    console.log(`[SpaceCraft Server Running]: http://${HOST}:${PORT}`);
    console.log(`[Environment]: ${process.env.NODE_ENV || 'development'}`);
  });

  server.on('error', (err) => {
    console.error(`[Server Listen Error]: ${err.message}`);
    process.exit(1);
  });

  try {
    await connectDB();
  } catch (error) {
    console.error(`[Database Connection Warning]: ${error.message}`);
    console.error('Server will continue running. Verify MONGODB_URI and IP whitelist in Atlas.');
  }

  return server;
};

startServer();

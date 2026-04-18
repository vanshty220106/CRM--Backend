require('dotenv').config();

const http      = require('http');
const app       = require('./app');
const connectDB = require('./config/db');
const { Server } = require('socket.io');
const { initClassifier } = require('./services/mlClassifier');

const PORT = process.env.PORT || 5001;

const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  process.env.CORS_ORIGIN,
].filter(Boolean);

const startServer = async () => {
  // Try connecting to Atlas; falls back to local files on failure.
  await connectDB();

  // Create HTTP server from Express app
  const server = http.createServer(app);

  // ── Socket.io ──────────────────────────────────────────────────────────────
  const io = new Server(server, {
    cors: {
      origin: ALLOWED_ORIGINS,
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  // Make io accessible from Express routes via req.app.get('io')
  app.set('io', io);

  io.on('connection', (socket) => {
    console.log(`🔌 Client connected: ${socket.id}`);

    socket.on('disconnect', () => {
      console.log(`🔌 Client disconnected: ${socket.id}`);
    });
  });

  // ── Start HTTP + WebSocket server ──────────────────────────────────────────
  server.listen(PORT, () => {
    console.log(
      `🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`
    );
    console.log(`🔌 Socket.io ready on port ${PORT}`);
  });

  // ── Pre-load ML model (async, non-blocking) ───────────────────────────────
  initClassifier().catch((err) => {
    console.warn('⚠️  ML model pre-load failed (will use keyword fallback):', err.message);
  });

  // ── Graceful shutdown ──────────────────────────────────────────────────────
  const shutdown = (signal) => {
    console.log(`\n${signal} received. Shutting down gracefully...`);
    io.close();
    server.close(() => {
      console.log('💤 Server closed.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT',  () => shutdown('SIGINT'));

  process.on('unhandledRejection', (err) => {
    console.error('💥 UNHANDLED REJECTION:', err.message);
    // Don't exit — just log
  });

  process.on('uncaughtException', (err) => {
    console.error('💥 UNCAUGHT EXCEPTION:', err.message);
    // Don't exit on db errors
    if (err.message?.includes('MongoDB') || err.message?.includes('mongo')) return;
    process.exit(1);
  });
};

startServer();

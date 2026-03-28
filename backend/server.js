require('dotenv').config();

const app       = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5001;

const startServer = async () => {
  // Try connecting to Atlas; falls back to local files on failure.
  await connectDB();

  // Always start the HTTP server — it will use local storage if Atlas is unavailable.
  const server = app.listen(PORT, () => {
    console.log(
      `🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`
    );
  });

  // ── Graceful shutdown ──────────────────────────────────────────────────────
  const shutdown = (signal) => {
    console.log(`\n${signal} received. Shutting down gracefully...`);
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

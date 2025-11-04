import express from 'express';
import cors from 'cors';
import { requestLogger } from './middleware/logger.js';

// Import routes
import usersRouter from './routes/users.js';
import projectsRouter from './routes/projects.js';
import tasksRouter from './routes/tasks.js';
import commentsRouter from './routes/comments.js';
import activityRouter from './routes/activity.js';
import metricsRouter from './routes/metrics.js';
import searchRouter from './routes/search.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON bodies
app.use(requestLogger); // Log all requests

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/users', usersRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/tasks', tasksRouter);
app.use('/api/comments', commentsRouter);
app.use('/api/activity', activityRouter);
app.use('/api/metrics', metricsRouter);
app.use('/api/search', searchRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] Error:`, err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║   🚀 React Query Training API Server                        ║
║                                                              ║
║   Server running on: http://localhost:${PORT}                        ║
║                                                              ║
║   Endpoints available:                                       ║
║   • GET    /api/users                                        ║
║   • GET    /api/projects                                     ║
║   • GET    /api/tasks                                        ║
║   • GET    /api/comments                                     ║
║   • GET    /api/activity                                     ║
║   • GET    /api/metrics                                      ║
║   • GET    /api/search?q=query                              ║
║                                                              ║
║   Features:                                                  ║
║   ✓ Network delays (1000-5000ms)                            ║
║   ✓ Random errors (1-5% per endpoint)                      ║
║   ✓ Request logging                                         ║
║   ✓ Pagination support                                      ║
║   ✓ Cursor-based pagination                                 ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
  `);
});

import express from 'express';
import { metrics, tasks, projects, getNextMetricId } from '../data/index.js';
import { delayMiddleware } from '../middleware/delay.js';
import { errorMiddleware } from '../middleware/errors.js';

const router = express.Router();

router.use(delayMiddleware(1000, 2500));
router.use(errorMiddleware(0.01)); // 1% error rate

// GET /api/metrics - Get all metrics (good for background refetch demo)
router.get('/', (req, res) => {
  // Recalculate metrics on each request for background refetch demo
  const recalculatedMetrics = [
    { id: 1, name: 'total_tasks', value: tasks.length },
    {
      id: 2,
      name: 'completed_tasks',
      value: tasks.filter((t) => t.status === 'completed').length,
    },
    { id: 3, name: 'active_projects', value: projects.length },
    {
      id: 4,
      name: 'in_progress_tasks',
      value: tasks.filter((t) => t.status === 'in-progress').length,
    },
  ];

  res.json(recalculatedMetrics);
});

// GET /api/metrics/:name - Get metric by name
router.get('/:name', (req, res) => {
  const name = req.params.name;
  const metric = metrics.find((m) => m.name === name);

  if (!metric) {
    return res.status(404).json({ error: 'Metric not found' });
  }

  res.json(metric);
});

export default router;

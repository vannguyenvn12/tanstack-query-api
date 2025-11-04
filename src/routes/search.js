import express from 'express';
import { tasks, projects, users } from '../data/index.js';
import { delayMiddleware } from '../middleware/delay.js';
import { errorMiddleware } from '../middleware/errors.js';

const router = express.Router();

router.use(delayMiddleware(2000, 5000));
router.use(errorMiddleware(0.02)); // 2% error rate

// GET /api/search - Global search (for manual queries demo)
router.get('/', (req, res) => {
  const query = req.query.q || '';
  const type = req.query.type; // Optional: 'tasks', 'projects', 'users', or 'all'

  if (!query || query.trim().length === 0) {
    return res.status(400).json({ error: 'Search query (q) is required' });
  }

  const searchTerm = query.toLowerCase().trim();
  const results = {
    tasks: [],
    projects: [],
    users: [],
  };

  // Search tasks
  if (!type || type === 'tasks' || type === 'all') {
    results.tasks = tasks.filter(
      (task) =>
        task.title.toLowerCase().includes(searchTerm) ||
        task.status.toLowerCase().includes(searchTerm)
    );
  }

  // Search projects
  if (!type || type === 'projects' || type === 'all') {
    results.projects = projects.filter(
      (project) =>
        project.name.toLowerCase().includes(searchTerm) ||
        (project.description &&
          project.description.toLowerCase().includes(searchTerm))
    );
  }

  // Search users
  if (!type || type === 'users' || type === 'all') {
    results.users = users.filter((user) =>
      user.name.toLowerCase().includes(searchTerm)
    );
  }

  const totalResults =
    results.tasks.length + results.projects.length + results.users.length;

  res.json({
    query: searchTerm,
    total: totalResults,
    results,
  });
});

export default router;

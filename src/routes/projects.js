import express from 'express';
import {
  projects,
  tasks,
  getNextProjectId,
  activity,
  getNextActivityId,
} from '../data/index.js';
import { delayMiddleware } from '../middleware/delay.js';
import { errorMiddleware } from '../middleware/errors.js';

const router = express.Router();

router.use(delayMiddleware(1000, 2500));
// router.use(errorMiddleware(0.04)); //  4% error rate

// GET /api/projects/users/:id - Get projects by user ID
router.get('/users/:userId', (req, res) => {
  const id = parseInt(req.params.userId);

  if (!id) {
    return res.status(404).json({ error: 'User not found' });
  }

  const results = projects.filter((p) => p.ownerId === id);

  res.json(results);
});

// GET /api/projects - Get all projects
router.get('/', (req, res) => {
  // Optionally include task counts for dependent queries demo
  const includeTaskCount = req.query.includeTaskCount === 'true';

  if (includeTaskCount) {
    const projectsWithCounts = projects.map((project) => ({
      ...project,
      taskCount: tasks.filter((t) => t.projectId === project.id).length,
    }));
    return res.json(projectsWithCounts);
  }

  res.json(projects);
});

// GET /api/projects/:id - Get project by ID
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const project = projects.find((p) => p.id === id);

  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }

  res.json(project);
});

// GET /api/projects/:id/page-tasks - Get project by ID
router.get('/:id/page-tasks', (req, res) => {
  const id = parseInt(req.params.id);
  const project = projects.find((p) => p.id === id);

  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }

  const projectTasks = tasks.filter((t) => t.projectId === id);

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  if (page <= 0 || limit <= 0) {
    return res
      .status(400)
      .json({ error: 'Page and limit must be positive numbers' });
  }

  const totalItems = projectTasks.length;
  const totalPages = Math.ceil(totalItems / limit);

  if (page > totalPages && totalPages > 0) {
    return res.status(200).json({
      totalItems,
      totalPages,
      currentPage: page,
      items: [],
    });
  }

  const start = (page - 1) * limit;
  const end = start + limit;
  const items = projectTasks.slice(start, end);

  res.json({
    totalItems,
    totalPages,
    currentPage: page,
    items,
  });
});

// GET /api/projects/:id/tasks - Get tasks for a project
router.get('/:id/tasks', (req, res) => {
  const id = parseInt(req.params.id);
  const project = projects.find((p) => p.id === id);

  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }

  const projectTasks = tasks.filter((t) => t.projectId === id);
  res.json(projectTasks);
});

// POST /api/projects - Create a new project
router.post('/', express.json(), (req, res) => {
  const { name, description, ownerId } = req.body;

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return res.status(400).json({ error: 'Name is required' });
  }

  if (ownerId && !Number.isInteger(ownerId)) {
    return res.status(400).json({ error: 'ownerId must be an integer' });
  }

  const newProject = {
    id: getNextProjectId(),
    name: name.trim(),
    description: description || '',
    ownerId: ownerId || null,
  };

  projects.push(newProject);

  // Add activity log
  activity.push({
    id: getNextActivityId(),
    type: 'project_created',
    message: `Project '${newProject.name}' was created`,
    createdAt: new Date().toISOString(),
  });

  res.status(201).json(newProject);
});

// PATCH /api/projects/:id - Update project
router.patch('/:id', express.json(), (req, res) => {
  const id = parseInt(req.params.id);
  const project = projects.find((p) => p.id === id);

  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }

  const { name, description, ownerId } = req.body;

  if (name !== undefined) {
    if (typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({ error: 'Name must be a non-empty string' });
    }
    project.name = name.trim();
  }

  if (description !== undefined) {
    project.description = description || '';
  }

  if (ownerId !== undefined) {
    if (!Number.isInteger(ownerId)) {
      return res.status(400).json({ error: 'ownerId must be an integer' });
    }
    project.ownerId = ownerId;
  }

  res.json(project);
});

// DELETE /api/projects/:id - Delete project
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = projects.findIndex((p) => p.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Project not found' });
  }

  // Also delete associated tasks (cascade delete)
  const tasksToDelete = tasks.filter((t) => t.projectId === id);
  tasksToDelete.forEach((task) => {
    const taskIndex = tasks.findIndex((t) => t.id === task.id);
    if (taskIndex !== -1) tasks.splice(taskIndex, 1);
  });

  projects.splice(index, 1);

  res.status(204).send();
});

export default router;

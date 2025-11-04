import express from 'express';
import {
  tasks,
  projects,
  users,
  comments,
  activity,
  getNextTaskId,
  getNextActivityId,
} from '../data/index.js';
import { delayMiddleware } from '../middleware/delay.js';
import { errorMiddleware } from '../middleware/errors.js';

const router = express.Router();

router.use(delayMiddleware(2000, 5000));
router.use(errorMiddleware(0.05)); // 5% error rate

// GET /api/tasks - Get all tasks (supports pagination)
router.get('/', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const status = req.query.status; // Filter by status
  const projectId = req.query.projectId ? parseInt(req.query.projectId) : null;

  let filteredTasks = [...tasks];

  // Filter by status if provided
  if (status) {
    filteredTasks = filteredTasks.filter((t) => t.status === status);
  }

  // Filter by projectId if provided
  if (projectId) {
    filteredTasks = filteredTasks.filter((t) => t.projectId === projectId);
  }

  // Pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedTasks = filteredTasks.slice(startIndex, endIndex);

  res.json({
    data: paginatedTasks,
    pagination: {
      page,
      limit,
      total: filteredTasks.length,
      totalPages: Math.ceil(filteredTasks.length / limit),
      hasNext: endIndex < filteredTasks.length,
      hasPrev: page > 1,
    },
  });
});

// GET /api/tasks/:id - Get task by ID
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const task = tasks.find((t) => t.id === id);

  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  // Optionally include related data
  const includeRelations = req.query.include === 'all';
  if (includeRelations) {
    const project = projects.find((p) => p.id === task.projectId);
    const assignee = task.assigneeId
      ? users.find((u) => u.id === task.assigneeId)
      : null;
    const taskComments = comments.filter((c) => c.taskId === task.id);

    return res.json({
      ...task,
      project,
      assignee,
      comments: taskComments,
    });
  }

  res.json(task);
});

// POST /api/tasks - Create a new task
router.post('/', express.json(), (req, res) => {
  const { projectId, title, status, assigneeId } = req.body;

  if (!projectId || !Number.isInteger(projectId)) {
    return res
      .status(400)
      .json({ error: 'projectId is required and must be an integer' });
  }

  // Verify project exists
  const project = projects.find((p) => p.id === projectId);
  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }

  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    return res.status(400).json({ error: 'Title is required' });
  }

  const validStatuses = ['todo', 'in-progress', 'completed', 'blocked'];
  const taskStatus = status && validStatuses.includes(status) ? status : 'todo';

  if (
    assigneeId !== undefined &&
    assigneeId !== null &&
    !Number.isInteger(assigneeId)
  ) {
    return res
      .status(400)
      .json({ error: 'assigneeId must be an integer or null' });
  }

  const newTask = {
    id: getNextTaskId(),
    projectId,
    title: title.trim(),
    status: taskStatus,
    assigneeId: assigneeId || null,
  };

  tasks.push(newTask);

  // Add activity log
  activity.push({
    id: getNextActivityId(),
    type: 'task_created',
    message: `Task '${newTask.title}' was created`,
    createdAt: new Date().toISOString(),
  });

  res.status(201).json(newTask);
});

// PATCH /api/tasks/:id - Update task (for optimistic updates demo)
router.patch('/:id', express.json(), (req, res) => {
  const id = parseInt(req.params.id);
  const task = tasks.find((t) => t.id === id);

  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  const { title, status, assigneeId, projectId } = req.body;

  if (title !== undefined) {
    if (typeof title !== 'string' || title.trim().length === 0) {
      return res
        .status(400)
        .json({ error: 'Title must be a non-empty string' });
    }
    task.title = title.trim();
  }

  if (status !== undefined) {
    const validStatuses = ['todo', 'in-progress', 'completed', 'blocked'];
    if (!validStatuses.includes(status)) {
      return res
        .status(400)
        .json({ error: `Status must be one of: ${validStatuses.join(', ')}` });
    }
    const oldStatus = task.status;
    task.status = status;

    // Add activity log for status change
    if (oldStatus !== status) {
      activity.push({
        id: getNextActivityId(),
        type: 'task_updated',
        message: `Task '${task.title}' status changed from ${oldStatus} to ${status}`,
        createdAt: new Date().toISOString(),
      });
    }
  }

  if (assigneeId !== undefined) {
    if (assigneeId !== null && !Number.isInteger(assigneeId)) {
      return res
        .status(400)
        .json({ error: 'assigneeId must be an integer or null' });
    }
    task.assigneeId = assigneeId;
  }

  if (projectId !== undefined) {
    if (!Number.isInteger(projectId)) {
      return res.status(400).json({ error: 'projectId must be an integer' });
    }
    const project = projects.find((p) => p.id === projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    task.projectId = projectId;
  }

  res.json(task);
});

// DELETE /api/tasks/:id - Delete task
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = tasks.findIndex((t) => t.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  // Also delete associated comments (cascade delete)
  const commentsToDelete = comments.filter((c) => c.taskId === id);
  commentsToDelete.forEach((comment) => {
    const commentIndex = comments.findIndex((c) => c.id === comment.id);
    if (commentIndex !== -1) comments.splice(commentIndex, 1);
  });

  tasks.splice(index, 1);

  res.status(204).send();
});

export default router;

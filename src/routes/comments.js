import express from 'express';
import { comments, tasks, users, getNextCommentId } from '../data/index.js';
import { delayMiddleware } from '../middleware/delay.js';
import { errorMiddleware } from '../middleware/errors.js';

const router = express.Router();

router.use(delayMiddleware(1000, 2500));
router.use(errorMiddleware(0.03)); // 3% error rate

// GET /api/comments - Get all comments (optionally filter by taskId)
router.get('/', (req, res) => {
  const taskId = req.query.taskId ? parseInt(req.query.taskId) : null;

  let filteredComments = [...comments];

  if (taskId) {
    filteredComments = filteredComments.filter((c) => c.taskId === taskId);
  }

  // Sort by createdAt descending (newest first)
  filteredComments.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  res.json(filteredComments);
});

// GET /api/comments/:id - Get comment by ID
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const comment = comments.find((c) => c.id === id);

  if (!comment) {
    return res.status(404).json({ error: 'Comment not found' });
  }

  res.json(comment);
});

// POST /api/comments - Create a new comment
router.post('/', express.json(), (req, res) => {
  const { taskId, userId, content } = req.body;

  if (!taskId || !Number.isInteger(taskId)) {
    return res
      .status(400)
      .json({ error: 'taskId is required and must be an integer' });
  }

  // Verify task exists
  const task = tasks.find((t) => t.id === taskId);
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  if (!userId || !Number.isInteger(userId)) {
    return res
      .status(400)
      .json({ error: 'userId is required and must be an integer' });
  }

  // Verify user exists
  const user = users.find((u) => u.id === userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  if (!content || typeof content !== 'string' || content.trim().length === 0) {
    return res.status(400).json({ error: 'Content is required' });
  }

  const newComment = {
    id: getNextCommentId(),
    taskId,
    userId,
    content: content.trim(),
    createdAt: new Date().toISOString(),
  };

  comments.push(newComment);
  res.status(201).json(newComment);
});

// PATCH /api/comments/:id - Update comment
router.patch('/:id', express.json(), (req, res) => {
  const id = parseInt(req.params.id);
  const comment = comments.find((c) => c.id === id);

  if (!comment) {
    return res.status(404).json({ error: 'Comment not found' });
  }

  const { content } = req.body;

  if (content !== undefined) {
    if (typeof content !== 'string' || content.trim().length === 0) {
      return res
        .status(400)
        .json({ error: 'Content must be a non-empty string' });
    }
    comment.content = content.trim();
  }

  res.json(comment);
});

// DELETE /api/comments/:id - Delete comment
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = comments.findIndex((c) => c.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Comment not found' });
  }

  comments.splice(index, 1);
  res.status(204).send();
});

export default router;

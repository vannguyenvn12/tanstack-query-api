import express from 'express';
import { users, getNextUserId } from '../data/index.js';
import { delayMiddleware } from '../middleware/delay.js';
import { errorMiddleware } from '../middleware/errors.js';

const router = express.Router();

// Apply delay and random error middleware
router.use(delayMiddleware(2000, 5000));
// router.use(errorMiddleware(0.03)); // 3% error rate

// GET /api/users - Get all users
router.get('/', (req, res) => {
  res.json(users);
});

// GET /api/users/:id - Get user by ID
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const user = users.find((u) => u.id === id);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json(user);
});

// POST /api/users - Create a new user
router.post('/', express.json(), (req, res) => {
  const { name } = req.body;

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return res.status(400).json({ error: 'Name is required' });
  }

  const newUser = {
    id: getNextUserId(),
    name: name.trim(),
  };

  users.push(newUser);
  res.status(201).json(newUser);
});

// PATCH /api/users/:id - Update user
router.patch('/:id', express.json(), (req, res) => {
  const id = parseInt(req.params.id);
  const user = users.find((u) => u.id === id);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const { name } = req.body;
  if (name !== undefined) {
    if (typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({ error: 'Name must be a non-empty string' });
    }
    user.name = name.trim();
  }

  res.json(user);
});

// DELETE /api/users/:id - Delete user
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = users.findIndex((u) => u.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'User not found' });
  }

  users.splice(index, 1);
  res.status(204).send();
});

export default router;

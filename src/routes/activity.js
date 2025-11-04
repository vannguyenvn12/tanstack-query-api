import express from 'express';
import { activity } from '../data/index.js';
import { delayMiddleware } from '../middleware/delay.js';
import { errorMiddleware } from '../middleware/errors.js';

const router = express.Router();

router.use(delayMiddleware(1000, 2500));
router.use(errorMiddleware(0.02)); // 2% error rate

// GET /api/activity - Get all activity logs (supports pagination and infinite scroll)
router.get('/', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const cursor = req.query.cursor; // For cursor-based pagination (infinite queries)

  // Sort by createdAt descending (newest first)
  const sortedActivity = [...activity].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  if (cursor) {
    // Cursor-based pagination for infinite queries
    const cursorIndex = sortedActivity.findIndex(
      (a) => a.id === parseInt(cursor)
    );
    if (cursorIndex === -1) {
      return res.json({
        data: [],
        nextCursor: null,
        hasMore: false,
      });
    }

    const nextItems = sortedActivity.slice(
      cursorIndex + 1,
      cursorIndex + 1 + limit
    );
    const nextCursor =
      nextItems.length === limit &&
      cursorIndex + 1 + limit < sortedActivity.length
        ? nextItems[nextItems.length - 1].id
        : null;

    return res.json({
      data: nextItems,
      nextCursor,
      hasMore: nextCursor !== null,
    });
  }

  // Offset-based pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedActivity = sortedActivity.slice(startIndex, endIndex);

  res.json({
    data: paginatedActivity,
    pagination: {
      page,
      limit,
      total: sortedActivity.length,
      totalPages: Math.ceil(sortedActivity.length / limit),
      hasNext: endIndex < sortedActivity.length,
      hasPrev: page > 1,
    },
  });
});

// GET /api/activity/:id - Get activity by ID
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const activityItem = activity.find((a) => a.id === id);

  if (!activityItem) {
    return res.status(404).json({ error: 'Activity not found' });
  }

  res.json(activityItem);
});

export default router;

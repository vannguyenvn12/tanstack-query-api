# React Query Training API Server

A fake API server designed specifically for teaching React Query (TanStack Query) from beginner to advanced concepts. This server simulates a "Project Tracker" application similar to Jira/Trello.

## Features

- ✅ **No Database** - All data stored in-memory (JavaScript arrays)
- ✅ **Realistic Network Delays** - Random delays between 100-1000ms per endpoint
- ✅ **Random Errors** - Configurable error rates (1-5% per endpoint) for error handling practice
- ✅ **Request Logging** - All requests logged with timestamps and response times
- ✅ **CORS Enabled** - Ready for frontend development

## Installation

```bash
npm install
```

## Running the Server

```bash
npm start
```

The server will start on `http://localhost:3001` (or the port specified in the `PORT` environment variable).

## Project Structure

```
api/
├── src/
│   ├── server.js              # Main server entry point
│   ├── data/
│   │   └── index.js          # In-memory data store
│   ├── middleware/
│   │   ├── delay.js          # Network delay simulation
│   │   ├── errors.js         # Random error simulation
│   │   └── logger.js         # Request logging
│   └── routes/
│       ├── users.js          # User endpoints
│       ├── projects.js       # Project endpoints
│       ├── tasks.js          # Task endpoints (with pagination)
│       ├── comments.js       # Comment endpoints
│       ├── activity.js       # Activity log endpoints (infinite queries)
│       ├── metrics.js        # Metrics endpoints (background refetch)
│       └── search.js         # Search endpoints (manual queries)
├── package.json
└── README.md
```

## Data Models

### Users
```json
{
  "id": 1,
  "name": "Alice Johnson"
}
```

### Projects
```json
{
  "id": 1,
  "name": "E-commerce Platform",
  "description": "Building a modern online shopping experience",
  "ownerId": 1
}
```

### Tasks
```json
{
  "id": 1,
  "projectId": 1,
  "title": "Design user authentication flow",
  "status": "in-progress",
  "assigneeId": 1
}
```

### Comments
```json
{
  "id": 1,
  "taskId": 1,
  "userId": 1,
  "content": "Started working on the authentication flow",
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

### Activity
```json
{
  "id": 1,
  "type": "task_created",
  "message": "Task 'Design user authentication flow' was created",
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

### Metrics
```json
{
  "id": 1,
  "name": "total_tasks",
  "value": 6
}
```

## API Endpoints

### Users

- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create a new user
- `PATCH /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Projects

- `GET /api/projects` - Get all projects
  - Query params: `?includeTaskCount=true` - Include task counts
- `GET /api/projects/:id` - Get project by ID
- `GET /api/projects/:id/tasks` - Get tasks for a project (dependent queries)
- `POST /api/projects` - Create a new project
- `PATCH /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project (cascades to tasks)

### Tasks

- `GET /api/tasks` - Get all tasks (supports pagination)
  - Query params: `?page=1&limit=10&status=todo&projectId=1`
- `GET /api/tasks/:id` - Get task by ID
  - Query params: `?include=all` - Include project, assignee, and comments
- `POST /api/tasks` - Create a new task
- `PATCH /api/tasks/:id` - Update task (optimistic updates)
- `DELETE /api/tasks/:id` - Delete task (cascades to comments)

### Comments

- `GET /api/comments` - Get all comments
  - Query params: `?taskId=1` - Filter by task ID
- `GET /api/comments/:id` - Get comment by ID
- `POST /api/comments` - Create a new comment
- `PATCH /api/comments/:id` - Update comment
- `DELETE /api/comments/:id` - Delete comment

### Activity

- `GET /api/activity` - Get activity logs
  - Query params: 
    - `?page=1&limit=10` - Offset-based pagination
    - `?cursor=5&limit=10` - Cursor-based pagination (infinite queries)
- `GET /api/activity/:id` - Get activity by ID

### Metrics

- `GET /api/metrics` - Get all metrics (recalculated on each request for background refetch demo)
- `GET /api/metrics/:name` - Get metric by name

### Search

- `GET /api/search?q=query` - Global search (manual queries demo)
  - Query params: `?q=search+term&type=tasks` (type: tasks, projects, users, or all)

### Health Check

- `GET /health` - Server health check

## React Query Teaching Scenarios

This API is designed to cover all major React Query concepts:

### 1. **Basic Fetching**
- Use `GET /api/users`, `GET /api/projects`, `GET /api/tasks`
- Demonstrate `useQuery` basics

### 2. **Dependent Queries**
- Fetch project first: `GET /api/projects/:id`
- Then fetch its tasks: `GET /api/projects/:id/tasks`
- Use `enabled` option in `useQuery`

### 3. **Caching and staleTime**
- Use `GET /api/metrics` (recalculated on each request)
- Demonstrate cache behavior with different `staleTime` values

### 4. **Mutations (POST/PATCH/DELETE)**
- Create: `POST /api/tasks`
- Update: `PATCH /api/tasks/:id`
- Delete: `DELETE /api/tasks/:id`
- Use `useMutation` hook

### 5. **Optimistic Updates**
- Use `PATCH /api/tasks/:id` to update task status
- Demonstrate optimistic UI updates

### 6. **Error + Retry Handling**
- All endpoints have random error rates (1-5%)
- Demonstrate React Query's automatic retry mechanism

### 7. **Pagination**
- Use `GET /api/tasks?page=1&limit=10`
- Demonstrate `keepPreviousData` or `placeholderData`

### 8. **Infinite Queries**
- Use `GET /api/activity?cursor=5&limit=10`
- Demonstrate `useInfiniteQuery` hook

### 9. **Background Refetch**
- Use `GET /api/metrics`
- Demonstrate `refetchInterval`, `refetchOnWindowFocus`, etc.

### 10. **Query Cancellation**
- Long-running requests (search endpoint: 400-1000ms delay)
- Demonstrate `queryClient.cancelQueries()` or component unmount cancellation

### 11. **Manual Queries**
- Use `GET /api/search?q=query`
- Demonstrate `enabled: false` and manual `refetch()`

## Example Usage

### Fetching Data
```javascript
// Basic query
const { data, isLoading, error } = useQuery({
  queryKey: ['users'],
  queryFn: () => fetch('http://localhost:3001/api/users').then(res => res.json())
});
```

### Dependent Queries
```javascript
// First query
const { data: project } = useQuery({
  queryKey: ['project', projectId],
  queryFn: () => fetch(`http://localhost:3001/api/projects/${projectId}`).then(res => res.json())
});

// Dependent query
const { data: tasks } = useQuery({
  queryKey: ['project-tasks', projectId],
  queryFn: () => fetch(`http://localhost:3001/api/projects/${projectId}/tasks`).then(res => res.json()),
  enabled: !!project // Only run when project is loaded
});
```

### Mutations
```javascript
const mutation = useMutation({
  mutationFn: (newTask) => fetch('http://localhost:3001/api/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newTask)
  }).then(res => res.json()),
  onSuccess: () => {
    queryClient.invalidateQueries(['tasks']);
  }
});
```

### Infinite Queries
```javascript
const {
  data,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
} = useInfiniteQuery({
  queryKey: ['activity'],
  queryFn: ({ pageParam = null }) => {
    const url = pageParam 
      ? `http://localhost:3001/api/activity?cursor=${pageParam}&limit=10`
      : `http://localhost:3001/api/activity?limit=10`;
    return fetch(url).then(res => res.json());
  },
  getNextPageParam: (lastPage) => lastPage.nextCursor,
});
```

## Network Delays

Each endpoint has configured delays to simulate real-world network conditions:

- **Users**: 200-600ms
- **Projects**: 300-700ms
- **Tasks**: 250-750ms
- **Comments**: 200-500ms
- **Activity**: 150-400ms
- **Metrics**: 100-300ms
- **Search**: 400-1000ms (longer for demo purposes)

## Error Rates

Random errors are injected with the following rates:

- **Users**: 3% error rate
- **Projects**: 4% error rate
- **Tasks**: 5% error rate
- **Comments**: 3% error rate
- **Activity**: 2% error rate
- **Metrics**: 1% error rate
- **Search**: 2% error rate

Errors return HTTP status codes: 500, 502, 503, or 504 with appropriate error messages.

## License

ISC


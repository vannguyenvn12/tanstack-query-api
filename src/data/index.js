// In-memory data store for the fake API
// All data is stored in arrays and persists only during server runtime

import { getManyTasks } from '../utils/seedTasks.js';

let nextUserId = 4;
let nextProjectId = 4;
let nextTaskId = 7;
let nextCommentId = 5;
let nextActivityId = 8;
let nextMetricId = 4;

export const users = [
  { id: 1, name: 'Alice Johnson' },
  { id: 2, name: 'Bob Smith' },
  { id: 3, name: 'Charlie Brown' },
];

export const projects = [
  {
    id: 1,
    name: 'E-commerce Platform',
    description: 'Building a modern online shopping experience',
    ownerId: 1,
  },
  {
    id: 2,
    name: 'Mobile App',
    description: 'iOS and Android app for customer engagement',
    ownerId: 2,
  },
  {
    id: 3,
    name: 'Dashboard Analytics',
    description: 'Real-time analytics and reporting dashboard',
    ownerId: 1,
  },
];

export const tasks = [
  {
    id: 1,
    projectId: 1,
    title: 'Design user authentication flow',
    status: 'in-progress',
    assigneeId: 1,
  },
  {
    id: 2,
    projectId: 1,
    title: 'Implement shopping cart',
    status: 'todo',
    assigneeId: 2,
  },
  {
    id: 3,
    projectId: 1,
    title: 'Add payment integration',
    status: 'todo',
    assigneeId: null,
  },
  {
    id: 4,
    projectId: 2,
    title: 'Create app icon',
    status: 'completed',
    assigneeId: 3,
  },
  {
    id: 5,
    projectId: 2,
    title: 'Setup push notifications',
    status: 'in-progress',
    assigneeId: 2,
  },
  {
    id: 6,
    projectId: 3,
    title: 'Build data visualization charts',
    status: 'in-progress',
    assigneeId: 1,
  },
];

// export const tasks = getManyTasks();

export const comments = [
  {
    id: 1,
    taskId: 1,
    userId: 1,
    content: 'Started working on the authentication flow',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 2,
    taskId: 1,
    userId: 2,
    content: 'Looking good! Can we add 2FA?',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 3,
    taskId: 2,
    userId: 2,
    content: 'Need to review the cart requirements',
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 4,
    taskId: 5,
    userId: 3,
    content: 'Push notifications are working in development',
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  },
];

export const activity = [
  {
    id: 1,
    type: 'task_created',
    message: "Task 'Design user authentication flow' was created",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 2,
    type: 'task_updated',
    message:
      "Task 'Design user authentication flow' status changed to in-progress",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 3,
    type: 'comment_added',
    message: "New comment on task 'Design user authentication flow'",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 4,
    type: 'task_completed',
    message: "Task 'Create app icon' was completed",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 5,
    type: 'project_created',
    message: "Project 'E-commerce Platform' was created",
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 6,
    type: 'task_created',
    message: "Task 'Implement shopping cart' was created",
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 7,
    type: 'task_updated',
    message: "Task 'Setup push notifications' status changed to in-progress",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const metrics = [
  { id: 1, name: 'total_tasks', value: 6 },
  { id: 2, name: 'completed_tasks', value: 1 },
  { id: 3, name: 'active_projects', value: 3 },
];

// Helper functions to get next IDs
export const getNextUserId = () => nextUserId++;
export const getNextProjectId = () => nextProjectId++;
export const getNextTaskId = () => nextTaskId++;
export const getNextCommentId = () => nextCommentId++;
export const getNextActivityId = () => nextActivityId++;
export const getNextMetricId = () => nextMetricId++;

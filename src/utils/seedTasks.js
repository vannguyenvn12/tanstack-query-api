function getManyTasks(projectCount = 5, tasksPerProject = 50) {
  const statuses = ['todo', 'in-progress', 'completed'];
  const titles = [
    'Design login screen',
    'Implement API integration',
    'Fix UI bugs',
    'Write unit tests',
    'Add dark mode',
    'Optimize images',
    'Setup CI/CD pipeline',
    'Refactor legacy code',
    'Build notification system',
    'Improve performance metrics',
  ];

  const tasks = [];
  let id = 1;

  for (let projectId = 1; projectId <= projectCount; projectId++) {
    for (let i = 0; i < tasksPerProject; i++) {
      const randomTitle = titles[Math.floor(Math.random() * titles.length)];
      const randomStatus =
        statuses[Math.floor(Math.random() * statuses.length)];
      const assigneeId =
        Math.random() < 0.8 ? Math.ceil(Math.random() * 5) : null;

      tasks.push({
        id: id++,
        projectId,
        title: `${randomTitle} #${i + 1}`,
        status: randomStatus,
        assigneeId,
      });
    }
  }

  return tasks;
}

// Nếu bạn cần dùng riêng function:
export { getManyTasks };

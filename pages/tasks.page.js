registerPageModule('tasks', function tasksPage() {
  return `
    <section class="page" id="page-tasks">
      <div class="page-header">
        <h1>Tasks</h1>
        <div class="task-filter-bar">
          <button class="filter-chip active" onclick="filterTasks('all', this)">All</button>
          <button class="filter-chip" onclick="filterTasks('open', this)">Open</button>
          <button class="filter-chip" onclick="filterTasks('done', this)">Done</button>
          <button class="filter-chip" onclick="filterTasks('overdue', this)">Overdue</button>
        </div>
      </div>
      <div class="task-list" id="taskList">Loading...</div>
    </section>
  `;
});

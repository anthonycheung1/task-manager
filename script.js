// ========================================
// Tell JavaScript to run the file in strict mode, i.e.,
// make JavaScript less forgiving about certain mistakes and
// catch some problems that would otherwise be allowed.
// ========================================

"use strict";

/*
  My Task Manager

  This JavaScript file handles:
  - Adding tasks
  - Editing tasks
  - Deleting tasks
  - Completing tasks
  - Saving tasks to localStorage
  - Filtering and searching tasks
  - Updating the task summary
*/

// --------------------------------------------------
// Default tasks
// --------------------------------------------------

const defaultTasks = [
  {
    id: 1,
    title: "Finish JavaScript/React project",
    description: "Complete the current frontend development project.",
    dueDate: "2026-09-05",
    priority: "high",
    completed: false
  },
  {
    id: 2,
    title: "Update CV",
    description: "Update the CV with recent frontend development projects.",
    dueDate: "2026-09-02",
    priority: "medium",
    completed: true
  },
  {
    id: 3,
    title: "Pay bills",
    description: "Pay outstanding bills.",
    dueDate: getToday(),
    priority: "high",
    completed: false
  }
];

// --------------------------------------------------
// Load tasks from localStorage
// --------------------------------------------------

const tasksKey = "tasksKey";
const storedTasks = localStorage.getItem(tasksKey);

let tasks = storedTasks ? JSON.parse(storedTasks) : defaultTasks;

// --------------------------------------------------
// Get elements from the HTML
// --------------------------------------------------

const taskForm = document.querySelector("#task-form");
const taskTitleInput = document.querySelector("#task-title");
const taskDescriptionInput = document.querySelector("#task-description");
const taskDueDateInput = document.querySelector("#task-due-date");
const taskPriorityInput = document.querySelector("#task-priority");
const submitTaskButton = document.querySelector("#submit-task-button");
const cancelTaskButton = document.querySelector("#cancel-task-button");
const taskListContainer = document.querySelector("#task-list-container");
const currentDateElement = document.querySelector("#current-date");
const userFeedback = document.querySelector("#user-feedback");
const activeCountElement = document.querySelector("#active-count");
const completedCountElement = document.querySelector("#completed-count");
const dueTodayCountElement = document.querySelector("#due-today-count");
const resultsCountElement = document.querySelector("#results-count");
const taskSearchInput = document.querySelector("#task-search");
const clearFiltersButton = document.querySelector("#clear-filters-button");
const activeFilterSummary = document.querySelector("#active-filter-summary");

// --------------------------------------------------
// Variables for the current filters and editing
// --------------------------------------------------

let editingTaskId = null;
let currentStatusFilter = "all";
let currentPriorityFilter = "all";
let currentSearch = "";

// --------------------------------------------------
// Get today's date
// --------------------------------------------------

function getToday() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

// --------------------------------------------------
// Format a date for display
// --------------------------------------------------

function formatDate(dateString) {
  if (!dateString) {
    return "No due date";
  }

  const date = new Date(`${dateString}T00:00:00`);

  return date.toLocaleDateString("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

// --------------------------------------------------
// Display today's date in the page header
// --------------------------------------------------

function displayCurrentDate() {
  const today = new Date();

  currentDateElement.textContent = today.toLocaleDateString("en-AU", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

// --------------------------------------------------
// Save tasks to localStorage
// --------------------------------------------------

function saveTasks() {
  localStorage.setItem(tasksKey, JSON.stringify(tasks));
}

// --------------------------------------------------
// Show a feedback message
// --------------------------------------------------

function showFeedback(message, type = "success") {
  userFeedback.textContent = message;
  userFeedback.className = `user-feedback ${type}`;
}

// --------------------------------------------------
// Update the task summary
// --------------------------------------------------

function updateSummary() {
  const activeTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);
  const dueTodayTasks = tasks.filter(task => {
    return task.dueDate === getToday() && !task.completed;
  });

  activeCountElement.textContent = activeTasks.length;
  completedCountElement.textContent = completedTasks.length;
  dueTodayCountElement.textContent = dueTodayTasks.length;
}

// --------------------------------------------------
// Reset the task form
// --------------------------------------------------

function resetForm() {
  taskForm.reset();
  taskDueDateInput.value = getToday();
  taskDueDateInput.min = getToday();
  taskPriorityInput.value = "medium";
  editingTaskId = null;
  submitTaskButton.textContent = "Add Task";
  updateSubmitButton();
}

// --------------------------------------------------
// Enable or disable the submit button
// --------------------------------------------------

function updateSubmitButton() {
  submitTaskButton.disabled = taskTitleInput.value.trim() === "";
}

// --------------------------------------------------
// Edit a task
// --------------------------------------------------

function editTask(taskId) {
  const task = tasks.find(task => task.id === taskId);

  if (!task) {
    return;
  }

  taskTitleInput.value = task.title;
  taskDescriptionInput.value = task.description;
  taskDueDateInput.value = task.dueDate;
  taskPriorityInput.value = task.priority;
  editingTaskId = taskId;
  submitTaskButton.textContent = "Save Changes";
  updateSubmitButton();
  taskTitleInput.focus();
  showFeedback("Editing task.", "success");
}

// --------------------------------------------------
// Cancel adding or editing a task
// --------------------------------------------------

function cancelTask() {
  const wasEditing = editingTaskId !== null;
  resetForm();

  if (wasEditing) {
    showFeedback("Task editing cancelled.", "success");
  } else {
    showFeedback("Task form cleared.", "success");
  }
}

// --------------------------------------------------
// Update the submit button when the title changes
// --------------------------------------------------

taskTitleInput.addEventListener("input", updateSubmitButton);

// --------------------------------------------------
// Add or edit a task
// --------------------------------------------------

taskForm.addEventListener("submit", event => {
  event.preventDefault();

  const title = taskTitleInput.value.trim();
  const description = taskDescriptionInput.value.trim();
  const dueDate = taskDueDateInput.value;
  const priority = taskPriorityInput.value;

  if (title === "") {
    showFeedback("Please enter a task title.", "error");
    taskTitleInput.focus();
    return;
  }

  if (dueDate === "") {
    showFeedback("Please select a due date.", "error");
    taskDueDateInput.focus();
    return;
  }

  if (dueDate < getToday()) {
    showFeedback("Please select today or a future date.", "error");
    taskDueDateInput.focus();
    return;
  }

  if (editingTaskId !== null) {
    const task = tasks.find(task => task.id === editingTaskId);

    if (task) {
      task.title = title;
      task.description = description;
      task.dueDate = dueDate;
      task.priority = priority;
      showFeedback("Task updated successfully.", "success");
    }
  } else {
    const newTask = {
      id: Date.now(),
      title: title,
      description: description,
      dueDate: dueDate,
      priority: priority,
      completed: false
    };

    tasks.push(newTask);
    showFeedback("Task added successfully.", "success");
  }

  saveTasks();
  resetForm();
  applyFilters();
});

// --------------------------------------------------
// Cancel button
// --------------------------------------------------

cancelTaskButton.addEventListener("click", cancelTask);

// --------------------------------------------------
// Toggle task completion
// --------------------------------------------------

function toggleTask(taskId) {
  const task = tasks.find(task => task.id === taskId);

  if (!task) {
    return;
  }

  task.completed = !task.completed;
  saveTasks();

  if (task.completed) {
    showFeedback(`"${task.title}" marked as complete.`, "success");
  } else {
    showFeedback(`"${task.title}" marked as incomplete.`, "success");
  }

  applyFilters();
}

// --------------------------------------------------
// Delete a task
// --------------------------------------------------

function deleteTask(taskId) {
  const task = tasks.find(task => task.id === taskId);

  if (!task) {
    return;
  }

  const confirmed = confirm(`Delete "${task.title}"?`);

  if (!confirmed) {
    return;
  }

  tasks = tasks.filter(task => task.id !== taskId);
  saveTasks();

  if (editingTaskId === taskId) {
    resetForm();
  }

  showFeedback("Task deleted successfully.", "success");
  applyFilters();
}

// --------------------------------------------------
// Get filtered tasks
// --------------------------------------------------

function getFilteredTasks() {
  return tasks.filter(task => {
    if (currentStatusFilter === "active" && task.completed) {
      return false;
    }

    if (currentStatusFilter === "completed" && !task.completed) {
      return false;
    }

    if (
      currentStatusFilter === "due-today" &&
      (task.dueDate !== getToday() || task.completed)
    ) {
      return false;
    }

    if (
      currentPriorityFilter !== "all" &&
      task.priority !== currentPriorityFilter
    ) {
      return false;
    }

    if (currentSearch !== "") {
      const searchText = currentSearch.toLowerCase();
      const titleMatches = task.title.toLowerCase().includes(searchText);
      const descriptionMatches = task.description.toLowerCase().includes(searchText);

      if (!titleMatches && !descriptionMatches) {
        return false;
      }
    }

    return true;
  });
}

// --------------------------------------------------
// Update which filter buttons look active
// --------------------------------------------------

function updateFilterButtons() {
  document.querySelectorAll("[data-status-filter]").forEach(button => {
    const isActive = button.dataset.statusFilter === currentStatusFilter;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", isActive);
  });

  document.querySelectorAll("[data-priority-filter]").forEach(button => {
    const isActive = button.dataset.priorityFilter === currentPriorityFilter;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", isActive);
  });
}

// --------------------------------------------------
// Show a summary of the active filters
// --------------------------------------------------

function updateFilterSummary() {
  const activeFilters = [];

  if (currentStatusFilter !== "all") {
    activeFilters.push(`Status: ${currentStatusFilter}`);
  }

  if (currentPriorityFilter !== "all") {
    activeFilters.push(`Priority: ${currentPriorityFilter}`);
  }

  if (currentSearch !== "") {
    activeFilters.push(`Search: "${currentSearch}"`);
  }

  if (activeFilters.length === 0) {
    activeFilterSummary.textContent = "";
    clearFiltersButton.hidden = true;
    return;
  }

  activeFilterSummary.textContent = `Active filters: ${activeFilters.join(" • ")}`;
  clearFiltersButton.hidden = false;
}

// --------------------------------------------------
// Status filter buttons
// --------------------------------------------------

document.querySelectorAll("[data-status-filter]").forEach(button => {
  button.addEventListener("click", () => {
    currentStatusFilter = button.dataset.statusFilter;
    applyFilters();
  });
});

// --------------------------------------------------
// Priority filter buttons
// --------------------------------------------------

document.querySelectorAll("[data-priority-filter]").forEach(button => {
  button.addEventListener("click", () => {
    currentPriorityFilter = button.dataset.priorityFilter;
    applyFilters();
  });
});

// --------------------------------------------------
// Search
// --------------------------------------------------

taskSearchInput.addEventListener("input", () => {
  currentSearch = taskSearchInput.value.trim();
  applyFilters();
});

// --------------------------------------------------
// Clear filters
// --------------------------------------------------

clearFiltersButton.addEventListener("click", () => {
  currentStatusFilter = "all";
  currentPriorityFilter = "all";
  currentSearch = "";
  taskSearchInput.value = "";
  applyFilters();
  showFeedback("Filters cleared.", "success");
});

// --------------------------------------------------
// Render the task list
// --------------------------------------------------

function renderTasks(tasksToDisplay) {
  taskListContainer.replaceChildren();

  if (tasks.length === 0) {
    const emptyMessage = document.createElement("div");
    emptyMessage.className = "empty-state";
    emptyMessage.innerHTML = `
      <h3>No tasks yet</h3>
      <p>Add your first task using the form.</p>
    `;
    taskListContainer.appendChild(emptyMessage);
    return;
  }

  if (tasksToDisplay.length === 0) {
    const emptyMessage = document.createElement("div");
    emptyMessage.className = "empty-state";
    emptyMessage.innerHTML = `
      <h3>No matching tasks</h3>
      <p>Try changing your filters or search.</p>
    `;
    taskListContainer.appendChild(emptyMessage);
    return;
  }

  tasksToDisplay.forEach(task => {
    const taskCard = document.createElement("article");
    taskCard.className = "task-card";

    if (task.completed) {
      taskCard.classList.add("completed");
    }

    const isOverdue = task.dueDate && task.dueDate < getToday() && !task.completed;

    if (isOverdue) {
      taskCard.classList.add("overdue");
    }

    const taskHeader = document.createElement("div");
    taskHeader.className = "task-header";

    const taskTitle = document.createElement("h3");
    taskTitle.textContent = task.title;

    const priorityBadge = document.createElement("span");
    priorityBadge.className = `priority-badge priority-${task.priority}`;
    priorityBadge.textContent = task.priority.charAt(0).toUpperCase() + task.priority.slice(1);

    taskHeader.append(taskTitle, priorityBadge);

    const taskDescription = document.createElement("p");
    taskDescription.className = "task-description";

    if (task.description) {
      taskDescription.textContent = task.description;
    } else {
      taskDescription.textContent = "No description provided.";
      taskDescription.classList.add("no-description");
    }

    const dueDateContainer = document.createElement("p");
    dueDateContainer.className = "task-due-date";

    const dueDateLabel = document.createElement("strong");
    dueDateLabel.textContent = "Due: ";

    const dueDate = document.createElement("time");
    dueDate.dateTime = task.dueDate;
    dueDate.textContent = formatDate(task.dueDate);

    dueDateContainer.append(dueDateLabel, dueDate);

    if (task.dueDate === getToday()) {
      dueDateContainer.classList.add("due-today");
      dueDateContainer.appendChild(document.createTextNode(" • Due today"));
    }

    if (isOverdue) {
      dueDateContainer.classList.add("overdue-text");
      dueDateContainer.appendChild(document.createTextNode(" • Overdue"));
    }

    const completionContainer = document.createElement("div");
    completionContainer.className = "completion-control";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.id = `task-${task.id}`;

    const checkboxLabel = document.createElement("label");
    checkboxLabel.htmlFor = checkbox.id;
    checkboxLabel.textContent = task.completed ? "Mark as incomplete" : "Mark as complete";
    checkbox.setAttribute(
      "aria-label",
      task.completed ? `Mark "${task.title}" as incomplete` : `Mark "${task.title}" as complete`
    );

    checkbox.addEventListener("change", () => toggleTask(task.id));
    completionContainer.append(checkbox, checkboxLabel);

    const actionButtons = document.createElement("div");
    actionButtons.className = "task-actions";

    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.className = "edit-button";
    editButton.textContent = "Edit";
    editButton.setAttribute("aria-label", `Edit "${task.title}"`);
    editButton.addEventListener("click", () => editTask(task.id));

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete-button";
    deleteButton.textContent = "Delete";
    deleteButton.setAttribute("aria-label", `Delete "${task.title}"`);
    deleteButton.addEventListener("click", () => deleteTask(task.id));

    actionButtons.append(editButton, deleteButton);
    taskCard.append(taskHeader, taskDescription, dueDateContainer, completionContainer, actionButtons);
    taskListContainer.appendChild(taskCard);
  });
}

// --------------------------------------------------
// Apply filters and update the page
// --------------------------------------------------

function applyFilters() {
  const filteredTasks = getFilteredTasks();

  updateSummary();
  updateFilterButtons();
  updateFilterSummary();
  renderTasks(filteredTasks);

  resultsCountElement.textContent =
    filteredTasks.length === 1 ? "1 task" : `${filteredTasks.length} tasks`;
}

// --------------------------------------------------
// Initial setup
// --------------------------------------------------

displayCurrentDate();
taskDueDateInput.value = getToday();
taskDueDateInput.min = getToday();
updateSubmitButton();
applyFilters();
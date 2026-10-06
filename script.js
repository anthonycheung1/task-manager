"use strict";

// --------------------------------------------------
// Task data
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

let tasks = [...defaultTasks];

// --------------------------------------------------
// Get elements
// --------------------------------------------------

const taskForm = document.querySelector("#task-form");
const taskTitleInput = document.querySelector("#task-title");
const taskDescriptionInput = document.querySelector("#task-description");
const taskDueDateInput = document.querySelector("#task-due-date");
const taskPriorityInput = document.querySelector("#task-priority");
const taskListContainer = document.querySelector("#task-list-container");
const submitTaskButton = document.querySelector("#submit-task-button");
const cancelTaskButton = document.querySelector("#cancel-task-button");
const resultsCountElement = document.querySelector("#results-count");
const activeCountElement = document.querySelector("#active-count");
const completedCountElement = document.querySelector("#completed-count");
const dueTodayCountElement = document.querySelector("#due-today-count");
const userFeedback = document.querySelector("#user-feedback");
const taskSearchInput = document.querySelector("#task-search");

// --------------------------------------------------
// Date helper
// --------------------------------------------------

function getToday() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatDate(dateString) {
  const date = new Date(`${dateString}T00:00:00`);

  return date.toLocaleDateString("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

let editingTaskId = null;

let currentStatusFilter = "all";
let currentPriorityFilter = "all";
let currentSearch = "";

const tasksKey = "tasksKey";
const storedTasks = localStorage.getItem(tasksKey);

tasks = storedTasks ? JSON.parse(storedTasks) : defaultTasks;

function saveTasks() {
  localStorage.setItem(tasksKey, JSON.stringify(tasks));
}

function showFeedback(message, type = "success") {
  userFeedback.textContent = message;
  userFeedback.className = `user-feedback ${type}`;
}

function updateSubmitButton() {
  submitTaskButton.disabled = taskTitleInput.value.trim() === "";
}

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
// Render tasks
// --------------------------------------------------

function renderTasks(tasksToDisplay) {
  taskListContainer.replaceChildren();

  tasksToDisplay.forEach(task => {
    const taskCard = document.createElement("article");
    taskCard.className = "task-card";

    if (task.completed) {
      taskCard.classList.add("completed");
    }

    const taskHeader = document.createElement("div");
    taskHeader.className = "task-header";

    const taskTitle = document.createElement("h3");
    taskTitle.textContent = task.title;

    const priorityBadge = document.createElement("span");
    priorityBadge.className = `priority-badge priority-${task.priority}`;
    priorityBadge.textContent = task.priority.charAt(0).toUpperCase() + task.priority.slice(1);

    taskHeader.append(taskTitle, priorityBadge);

    const description = document.createElement("p");
    description.className = "task-description";
    description.textContent = task.description || "No description provided.";

    const dueDate = document.createElement("p");
    dueDate.className = "task-due-date";
    dueDate.textContent = `Due: ${formatDate(task.dueDate)}`;

    const completionContainer = document.createElement("div");
    completionContainer.className = "completion-control";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.id = `task-${task.id}`;

    const checkboxLabel = document.createElement("label");
    checkboxLabel.htmlFor = checkbox.id;
    checkboxLabel.textContent = task.completed ? "Mark as incomplete" : "Mark as complete";

    checkbox.addEventListener("change", () => toggleTask(task.id));

    completionContainer.append(checkbox, checkboxLabel);

    const actionButtons = document.createElement("div");
    actionButtons.className = "task-actions";

    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.className = "edit-button";
    editButton.textContent = "Edit";
    editButton.addEventListener("click", () => editTask(task.id));

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete-button";
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => deleteTask(task.id));

    actionButtons.append(editButton, deleteButton);

    taskCard.append(taskHeader, description, dueDate);
    taskCard.appendChild(completionContainer);
    taskCard.appendChild(actionButtons);

    taskListContainer.appendChild(taskCard);
  });
}

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
    return;
  }

  if (dueDate === "") {
    showFeedback("Please select a due date.", "error");
    return;
  }

  if (dueDate < getToday()) {
    showFeedback("Please select today or a future date.", "error");
    return;
  }

  if (editingTaskId !== null) {
    const task = tasks.find(item => item.id === editingTaskId);

    if (task) {
      task.title = title;
      task.description = description;
      task.dueDate = dueDate;
      task.priority = priority;
    }
    saveTasks();
    showFeedback("Task updated successfully.", "success");

  } else {
    const newTask = {
      id: Date.now(),
      title,
      description,
      dueDate,
      priority,
      completed: false
    };

    tasks.push(newTask);
    saveTasks();
    showFeedback("Task added successfully.", "success");

  }
  resetForm();
  applyFilters();
});

function editTask(taskId) {
  const task = tasks.find(item => item.id === taskId);

  if (!task) {
    return;
  }

  taskTitleInput.value = task.title;
  taskDescriptionInput.value = task.description;
  taskDueDateInput.value = task.dueDate;
  taskPriorityInput.value = task.priority;
  editingTaskId = taskId;
  submitTaskButton.textContent = "Save Changes";

  if (typeof updateSubmitButton === "function") {
    updateSubmitButton();
  }
}

function deleteTask(taskId) {
  const task = tasks.find(item => item.id === taskId);

  if (!task) {
    return;
  }

  const confirmed = confirm(`Delete "${task.title}"?`);

  if (!confirmed) {
    return;
  }

  tasks = tasks.filter(item => item.id !== taskId);
  saveTasks();

  applyFilters();
}


function toggleTask(taskId) {
  const task = tasks.find(item => item.id === taskId);

  if (!task) {
    return;
  }

  task.completed = !task.completed;
  saveTasks();
  applyFilters();
}

function updateSummary() {
  const activeTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);
  const dueTodayTasks = tasks.filter(task => task.dueDate === getToday() && !task.completed);

  activeCountElement.textContent = activeTasks.length;
  completedCountElement.textContent = completedTasks.length;
  dueTodayCountElement.textContent = dueTodayTasks.length;
}

function getFilteredTasks() {
  return tasks.filter(task => {
    if (currentStatusFilter === "active" && task.completed) return false;
    if (currentStatusFilter === "completed" && !task.completed) return false;
    if (currentStatusFilter === "due-today" && (task.dueDate !== getToday() || task.completed)) return false;

    if (currentPriorityFilter !== "all" && task.priority !== currentPriorityFilter) return false;

    if (currentSearch !== "") {
      const searchText = currentSearch.toLowerCase();
      const titleMatches = task.title.toLowerCase().includes(searchText);
      const descriptionMatches = task.description.toLowerCase().includes(searchText);

      if (!titleMatches && !descriptionMatches) return false;
    }

    return true;
  });
}


const statusFilterButtons = document.querySelectorAll("[data-status-filter]");

statusFilterButtons.forEach(button => {
  button.addEventListener("click", () => {
    currentStatusFilter = button.dataset.statusFilter;
    applyFilters();
  });
});

function updateFilterButtons() {
  statusFilterButtons.forEach(button => {
    const isActive = button.dataset.statusFilter === currentStatusFilter;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", isActive);
  });

  priorityFilterButtons.forEach(button => {
    const isActive = button.dataset.priorityFilter === currentPriorityFilter;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", isActive);
  });
}

const priorityFilterButtons = document.querySelectorAll("[data-priority-filter]");

priorityFilterButtons.forEach(button => {
  button.addEventListener("click", () => {
    currentPriorityFilter = button.dataset.priorityFilter;
    applyFilters();
  });
});

taskSearchInput.addEventListener("input", () => {
  currentSearch = taskSearchInput.value.trim();
  applyFilters();
});


taskTitleInput.addEventListener("input", updateSubmitButton);


function applyFilters() {
  const filteredTasks = getFilteredTasks();

  updateSummary();
  updateFilterButtons();
  renderTasks(filteredTasks);

  resultsCountElement.textContent = filteredTasks.length === 1 ? "1 task" : `${filteredTasks.length} tasks`;
}

// --------------------------------------------------
// Initial setup
// --------------------------------------------------

taskDueDateInput.value = getToday();
taskDueDateInput.min = getToday();
updateSubmitButton();
applyFilters();
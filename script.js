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

// --------------------------------------------------
// Render tasks
// --------------------------------------------------

function renderTasks(tasksToDisplay) {
  taskListContainer.replaceChildren();

  tasksToDisplay.forEach(task => {
    const taskCard = document.createElement("article");
    taskCard.className = "task-card";

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

  if (editingTaskId !== null) {
    const task = tasks.find(item => item.id === editingTaskId);

    if (task) {
      task.title = title;
      task.description = description;
      task.dueDate = dueDate;
      task.priority = priority;
    }

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

  }
  taskForm.reset();
  taskDueDateInput.value = getToday();
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

  applyFilters();
}


function applyFilters() {
  const filteredTasks = getFilteredTasks();

  renderTasks(filteredTasks);

  resultsCountElement.textContent =
    filteredTasks.length === 1 ? "1 task" : `${filteredTasks.length} tasks`;
}

// --------------------------------------------------
// Initial setup
// --------------------------------------------------

taskDueDateInput.value = getToday();
applyFilters();
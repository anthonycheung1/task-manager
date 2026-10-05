"use strict";

function getToday() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

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

const taskForm = document.querySelector("#task-form");
const taskTitleInput = document.querySelector("#task-title");
const taskDescriptionInput = document.querySelector("#task-description");
const taskDueDateInput = document.querySelector("#task-due-date");
const taskPriorityInput = document.querySelector("#task-priority");
const taskListContainer = document.querySelector("#task-list-container");
const submitTaskButton = document.querySelector("#submit-task-button") || taskForm.querySelector("button[type=submit]");
let editingTaskId = null;

function formatDate(dateString) {
  const date = new Date(`${dateString}T00:00:00`);
  return date.toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" });
}

function getFilteredTasks() {
  return tasks;
}

function renderTasks(tasksToDisplay) {
  taskListContainer.replaceChildren();
  tasksToDisplay.forEach(task => {
    const card = document.createElement("article");
    card.className = "task-card";
    const header = document.createElement("div");
    header.className = "task-header";
    const title = document.createElement("h3");
    title.textContent = task.title;
    const badge = document.createElement("span");
    badge.className = `priority-badge priority-${task.priority}`;
    badge.textContent = task.priority.charAt(0).toUpperCase() + task.priority.slice(1);
    header.append(title, badge);
    const description = document.createElement("p");
    description.className = "task-description";
    description.textContent = task.description || "No description provided.";
    const dueDate = document.createElement("p");
    dueDate.className = "task-due-date";
    dueDate.textContent = `Due: ${formatDate(task.dueDate)}`;
    const actions = document.createElement("div");
    actions.className = "task-actions";
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
    actions.append(editButton, deleteButton);
    card.append(header, description, dueDate);
    card.appendChild(actions);
    taskListContainer.appendChild(card);
  });
}

taskForm.addEventListener("submit", event => {
  event.preventDefault();
  const title = taskTitleInput.value.trim();
  const description = taskDescriptionInput.value.trim();
  const dueDate = taskDueDateInput.value;
  const priority = taskPriorityInput.value;
  if (editingTaskId !== null) {
    const task = tasks.find(task => task.id === editingTaskId);
    if (task) {
      task.title = title;
      task.description = description;
      task.dueDate = dueDate;
      task.priority = priority;
    }
    if (typeof showFeedback === "function") showFeedback("Task updated successfully.");
    editingTaskId = null;
    submitTaskButton.textContent = "Add Task";
  } else {
    tasks.push({
      id: Date.now(),
      title,
      description,
      dueDate,
      priority,
      completed: false
    });
  }
  taskForm.reset();
  taskDueDateInput.value = getToday();
  applyFilters();
});

function editTask(taskId) {
  const task = tasks.find(task => task.id === taskId);
  if (!task) return;
  taskTitleInput.value = task.title;
  taskDescriptionInput.value = task.description;
  taskDueDateInput.value = task.dueDate;
  taskPriorityInput.value = task.priority;
  editingTaskId = taskId;
  submitTaskButton.textContent = "Save Changes";
  taskTitleInput.focus();
  if (typeof showFeedback === "function") showFeedback("Editing task.");
}

function deleteTask(taskId) {
  const task = tasks.find(task => task.id === taskId);
  if (!task) return;
  if (!confirm(`Delete "${task.title}"?`)) return;
  tasks = tasks.filter(task => task.id !== taskId);
  applyFilters();
}

function applyFilters() {
  const filteredTasks = getFilteredTasks();
  renderTasks(filteredTasks);
}

taskDueDateInput.value = getToday();
applyFilters();
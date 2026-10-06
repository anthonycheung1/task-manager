# My Task Manager

A responsive task management application built with HTML, CSS and vanilla JavaScript.

The application allows users to create, edit, complete and delete tasks, with tasks persisted in the browser using `localStorage`. It also provides filtering and search functionality to help users manage larger task lists.

## Live Demo

[View the live application](https://anthonycheung1.github.io/task-manager)

## Repository

[View the source code](https://github.com/anthonycheung1/task-manager)


## Features

- Add new tasks
- Edit existing tasks
- Cancel editing
- Mark tasks as complete or incomplete
- Delete tasks with confirmation
- Set task due dates
- Set task priorities
- Search tasks by title or description
- Filter tasks by:
  - All
  - Active
  - Completed
  - Due Today
- Filter tasks by priority:
  - All Priorities
  - Low
  - Medium
  - High
- Combine status/date filters with priority filters
- Clear all filters and search terms
- Display task statistics
- Display task counts based on the current task list
- Identify tasks that are due today or overdue
- Persist tasks using `localStorage`
- Form validation
- Empty and no-results states
- Responsive layout for desktop, tablet and mobile
- Keyboard-accessible controls
- Accessible filter state using ARIA attributes
- Screen-reader-friendly task action labels
- Reduced-motion support


## Technologies

- HTML5
- CSS3
- JavaScript (ES6+)
- Browser `localStorage` API


## Project Structure

```text
task-manager/
│
├── index.html
├── style.css
├── script.js
└── README.md
```

How It Works

Tasks are represented as JavaScript objects containing information such as their title, description, due date, priority and completion status.

A task has the following general structure:

{
  id: 1,
  title: "Example task",
  description: "Example description",
  dueDate: "2026-09-05",
  priority: "high",
  completed: false
}

The application maintains an array of tasks in JavaScript.

When a task is added, edited, completed or deleted, the task array is updated and saved to localStorage.

When the page is loaded, previously saved tasks are retrieved from localStorage and displayed.

Filtering and Search

The application uses separate pieces of state for:

status/date filtering;
priority filtering;
search terms.

The selected filters are combined when determining which tasks should be displayed.

For example, a user can select:

Status: Active
Priority: High
Search: project

The application will then display only active, high-priority tasks whose title or description contains the search term.

Task Status

Tasks can be in one of two states:

Active
Completed

Completed tasks are visually distinguished from active tasks using a strikethrough title and reduced visual emphasis.

Due dates are also interpreted relative to the current date.

Active tasks can be identified as:

Due today
Overdue
Future

Completed tasks are not presented as overdue.

Data Persistence

Tasks are stored in the browser using the localStorage API.

This means that tasks remain available when the user refreshes or revisits the page in the same browser.

No external database or backend is required.

Accessibility

Accessibility was considered throughout the application.

Examples include:

Semantic HTML elements such as main, section, form, label, article and time
Explicit labels for form controls
Keyboard-accessible buttons and form controls
Visible keyboard focus indicators
ARIA labels for task-specific controls
aria-pressed states for filter buttons
Live regions for task/action feedback
Meaningful button labels for screen-reader users
Appropriate heading hierarchy
Support for reduced-motion preferences
Responsive Design

The application uses CSS Grid, Flexbox and media queries to adapt the layout to different screen sizes.

On larger screens, the application uses a two-column layout with the task summary and form displayed alongside the task content.

On smaller screens, the layout changes to a single-column structure and task controls are adjusted for easier touch interaction.

Validation and User Experience

The task form validates the task title before allowing a task to be submitted.

The interface also provides feedback for actions such as:

Adding a task
Updating a task
Completing a task
Deleting a task
Clearing filters

Different empty states are displayed when:

No tasks exist
A search produces no results
A selected filter produces no results
What I Learned

This project was built to strengthen my understanding of frontend development fundamentals.

Through the project I practised:

Structuring pages with semantic HTML
Styling responsive layouts with CSS
Working with the DOM
Handling user events
Managing application state with JavaScript
Creating and updating DOM elements dynamically
Working with arrays of objects
Using array methods such as filter() and findIndex()
Implementing search functionality
Combining multiple filters
Form validation
Browser localStorage
Managing UI state
Accessibility fundamentals
Responsive design
Organising JavaScript into reusable functions
Challenges

One of the main challenges was managing interactions between different parts of the application.

For example, filtering and searching are independent controls, but their results need to be combined consistently.

The application therefore maintains separate filter and search state and applies them together when determining which tasks should be displayed.

Another challenge was keeping the user interface synchronised with the underlying task data. After operations such as adding, editing, completing or deleting a task, the task list and statistics need to be updated consistently.

Future Improvements

Possible future improvements include:

Drag-and-drop task ordering
Task categories or tags
Dark mode
Sorting options
More advanced date filtering
Backend persistence
User accounts and authentication
Synchronisation between devices

These features are outside the scope of the current version.

Running Locally

No build tools or dependencies are required.

Clone the repository.
Open the project folder.
Open index.html in a browser.

Alternatively, use a local development server such as VS Code Live Server.

Author

Tony Cheung
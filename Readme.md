# Schedular Application

A modern, full-featured task planner built with Next.js and React, featuring drag & drop functionality, task scheduling, and filtering capabilities.

## Features

### 🗓️ Month View Calendar
- Interactive month view with drag & drop task management
- Visual task indicators with priority and category colors
- Easy navigation between months
- Today indicator and date selection

### 📝 Task Management
- Create, edit, and delete tasks
- Set task priorities (High, Medium, Low)
- Categorize tasks (Work, Meeting, Personal, Urgent, General)
- Add descriptions and time scheduling
- Mark tasks as completed
- **Multi-day task support with start/end dates**
- **Enhanced drag to resize task duration with visual feedback**
- **Real-time drag preview with duration calculation**
- **Smart validation to prevent invalid date ranges**

### 🔍 Advanced Filtering
- Filter by category
- Filter by priority level
- Filter by completion status
- **Time-based filtering with multiple options**
- **Time range filters (morning, afternoon, evening, night)**
- **Time of day filters (early, morning, lunch, afternoon, evening, night)**
- **Custom time range filtering (from/to specific times)**
- Clear all filters with one click

### 📱 Responsive Design
- Modern, clean UI with Tailwind CSS
- Mobile-friendly interface
- Smooth animations and transitions

## Components

### API Endpoints (`/api/tasks`)
- `GET /api/tasks` - Retrieve tasks with optional filtering
- `POST /api/tasks` - Create new task
- `PUT /api/tasks` - Update existing task
- `DELETE /api/tasks` - Delete task

### React Components
- **MonthView** - Calendar grid with drag & drop functionality
- **TaskForm** - Modal form for creating/editing tasks
- **TaskFilter** - Filter controls for tasks
- **TaskList** - List view of tasks with actions

## Usage

### Starting the Application
```bash
cd frontend
npm run dev
```

Navigate to `http://localhost:3000/task-planner` to access the task planner.

### Creating a Task
1. Click the "Add Task" button
2. Fill in the task details (title, description, date, time, priority, category)
3. Click "Create Task"

### Managing Tasks
- **Drag & Drop**: Drag tasks between dates in month view
- **Resize Tasks**: Drag the edges of multi-day tasks to adjust start/end dates
  - Visual resize handles appear on hover
  - Real-time preview shows new date range and duration
  - Smart validation prevents invalid date ranges
  - Smooth animations and visual feedback during drag
- **Edit**: Click on a task to edit it
- **Complete**: Use the checkmark button to mark tasks as completed
- **Delete**: Use the trash icon to delete tasks

### Filtering Tasks
- **Basic Filters**: Use dropdowns to filter by category, priority, or status
- **Time Range Filters**: Filter by morning (6:00-12:00), afternoon (12:00-18:00), evening (18:00-22:00), or night (22:00-6:00)
- **Time of Day Filters**: Filter by early (6:00-9:00), morning (9:00-12:00), lunch (12:00-14:00), afternoon (14:00-17:00), evening (17:00-20:00), or night (20:00-23:00)
- **Custom Time Range**: Set specific start and end times for precise filtering
- **Combined Filtering**: Use multiple filters together for advanced filtering
- Click "Clear Filters" to reset all filters

## Technical Details

### Drag & Drop Implementation
The drag & drop functionality is implemented using native HTML5 drag and drop API without external libraries:

```javascript
// Drag start
const handleDragStart = (e, task) => {
  setDraggedTask(task);
  e.dataTransfer.effectAllowed = 'move';
};

// Drop handling
const handleDrop = (e, day) => {
  e.preventDefault();
  if (draggedTask && day) {
    const newDate = formatDate(year, month, day);
    onTaskMove(draggedTask.id, newDate);
  }
};

// Task resizing
const handleResizeStart = (e, task, edge) => {
  e.stopPropagation();
  setResizingTask(task);
  setResizeEdge(edge);
  e.dataTransfer.effectAllowed = 'move';
};

// Resize drop handling
const handleResizeDrop = (e, day) => {
  e.preventDefault();
  if (resizingTask && day && resizeEdge) {
    const newDate = formatDate(year, month, day);
    onTaskResize(resizingTask.id, resizeEdge, newDate);
  }
};
```

### Data Storage
Currently uses in-memory storage for development. In production, integrate with a database like PostgreSQL or MongoDB.

### Styling
Built with Tailwind CSS for responsive design and modern UI components.

## Future Enhancements

- [ ] Database integration
- [ ] User authentication
- [ ] Task sharing and collaboration
- [ ] Recurring tasks
- [ ] Task templates
- [ ] Export functionality
- [ ] Mobile app version

Coded & Developed By
<b>Mohammad Zainulla</b><br />
<i>Software Developer</i>

'use client';

import { useState, useEffect } from 'react';
import MonthView from '../../components/MonthView';
import TaskForm from '../../components/TaskForm';
import TaskFilter from '../../components/TaskFilter';
import TaskList from '../../components/TaskList';

export default function TaskPlanner() {
  const [tasks, setTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    priority: '',
    completed: '',
    timeRange: '',
    timeOfDay: '',
    startTime: '',
    endTime: ''
  });
  const [view, setView] = useState('month'); // 'month' or 'list'

  // Fetch tasks from API
  const fetchTasks = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.priority) params.append('priority', filters.priority);
      if (filters.timeRange) params.append('timeRange', filters.timeRange);
      if (filters.timeOfDay) params.append('timeOfDay', filters.timeOfDay);
      if (filters.startTime) params.append('startTime', filters.startTime);
      if (filters.endTime) params.append('endTime', filters.endTime);

      const response = await fetch(`/api/tasks?${params.toString()}`);
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [filters]);

  // Create or update task
  const handleSaveTask = async (taskData) => {
    try {
      const url = editingTask ? '/api/tasks' : '/api/tasks';
      const method = editingTask ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });

      if (response.ok) {
        fetchTasks();
        setShowTaskForm(false);
        setEditingTask(null);
      }
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  // Delete task
  const handleDeleteTask = async (taskId) => {
    try {
      const response = await fetch(`/api/tasks?id=${taskId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchTasks();
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  // Toggle task completion
  const handleToggleComplete = async (taskId, completed) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: taskId, completed }),
      });

      if (response.ok) {
        fetchTasks();
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  // Handle task drag and drop
  const handleTaskMove = async (taskId, newDate) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: taskId, date: newDate, startDate: newDate, endDate: newDate }),
      });

      if (response.ok) {
        fetchTasks();
      }
    } catch (error) {
      console.error('Error moving task:', error);
    }
  };
  
  // Handle task resizing
  const handleTaskResize = async (taskId, edge, newDate) => {
    console.log('handleTaskResize called with:', { taskId, edge, newDate });

    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task) {
        console.error('Task not found for resizing:', taskId);
        return;
      }

      console.log('Found task for resizing:', task);

      const startDate = task.startDate || task.date;
      const endDate = task.endDate || task.date;

      console.log('Current task dates:', { startDate, endDate, newDate });

      // Validate the new date
      const newDateObj = new Date(newDate);
      const startDateObj = new Date(startDate);
      const endDateObj = new Date(endDate);

      if (isNaN(newDateObj.getTime())) {
        console.error('Invalid date provided for resizing:', newDate);
        return;
      }

      let newStartDate = startDate;
      let newEndDate = endDate;

      if (edge === 'start') {
        newStartDate = newDate;
        // Ensure start date is not after end date
        if (newDateObj > endDateObj) {
          newEndDate = newDate;
          console.log('Start date moved beyond end date, adjusting end date to match');
        }
      } else if (edge === 'end') {
        newEndDate = newDate;
        // Ensure end date is not before start date
        if (newDateObj < startDateObj) {
          newStartDate = newDate;
          console.log('End date moved before start date, adjusting start date to match');
        }
      }

      console.log('Calculated new dates:', { newStartDate, newEndDate });

      // Final validation
      const finalStartDate = new Date(newStartDate);
      const finalEndDate = new Date(newEndDate);

      if (finalStartDate > finalEndDate) {
        console.error('Invalid date range after resize');
        return;
      }

      const requestBody = {
        id: taskId,
        startDate: newStartDate,
        endDate: newEndDate,
        date: newStartDate // Update main date to start date
      };

      console.log('Sending resize request:', requestBody);

      const response = await fetch('/api/tasks', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const updatedTask = await response.json();
        console.log(`Task ${taskId} resized successfully:`, {
          edge,
          oldRange: `${startDate} to ${endDate}`,
          newRange: `${newStartDate} to ${newEndDate}`,
          updatedTask
        });
        fetchTasks();
      } else {
        const errorText = await response.text();
        console.error('Failed to resize task:', response.status, errorText);
      }
    } catch (error) {
      console.error('Error resizing task:', error);
    }
  };

  // Filter tasks based on current filters
  const filteredTasks = tasks.filter(task => {
    if (filters.completed !== '' && task.completed.toString() !== filters.completed) {
      return false;
    }
    return true;
  });
  // Handle contact toast
  const handleContactClick = (e) => {
    console.log('handleContactClick called');
    e.preventDefault();
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };
  return (
    <div className="min-h-screen bg-gray-50">
     
      <div data-animation="default" data-collapse="medium" data-duration="400" data-easing="ease" data-easing2="ease"
        role="banner" className="kutup-nav-component-1 w-nav">
        <div className="kutup-nav-container-1 w-container">
          <div className="kutup-first-element">
            <div className="kutup-horizontal-flex">
              <a href=""
                className="kutup-brand-link-line w-nav-brand">
                <img
                  src="logo.png"
                  loading="lazy"
                  width={100}
                  height={100}
                  alt="Logo"
                />
              </a>
              <div className="kutup-mobile-portrait-hide">
                <div className="kutup-flex-divider">
                  <a data-w-id="7cab4810-f5f8-4a86-2fc4-ee32fea0c864"
                    href=""
                    className="kutup-button-with-line w-inline-block">
                    <div>9902785933</div>
                    <div style={{ width: "0%" }} className="kutup-button-line"></div>
                  </a>
                  <a data-w-id="7cab4810-f5f8-4a86-2fc4-ee32fea0c868"
                    href=""
                    className="kutup-button-with-line w-inline-block">
                    <div>786zainulla@gmail.com</div>
                    <div style={{ width: "0%" }} className="kutup-button-line"></div>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="kutup-last-item">
            <nav role="navigation" className="kutup-nav-menu w-nav-menu">
              <a href="/"
                className="kutup-nav-link w-nav-link"
                style={{ maxWidth: "1200px" }}>Home</a>
              <a href="/task-planner"
                className="kutup-nav-link w-nav-link"
                style={{ maxWidth: "1200px" }}>Task Planner</a>
              <a href="tel:9902785933"
                className="kutup-nav-link w-nav-link" style={{ maxWidth: "1200px" }}>Contact</a>
            </nav>
            <div className="kutup-menu-button w-nav-button"
              style={{ WebkitUserSelect: "text" }}
              aria-label="menu"
              role="button"
              tabIndex="0"
              aria-controls="w-nav-overlay-0"
              aria-haspopup="menu"
              aria-expanded="false">
              <img
                src="icon-menu.svg"
                loading="lazy"
                width={30}
                height={30}
                alt="Menu icon"
              />
            </div>
          </div>
        </div>
        <div className="w-nav-overlay" data-wf-ignore="" id="w-nav-overlay-0"></div>
      </div>
      <div className="bg-white shadow-sm border-b mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Schedular</h1>
              <p className="text-gray-600">Now manage your tasks with drag, drop & scalable functionality</p>
            </div>
            <div className="flex space-x-4" style={{ gap: "15px" }}>
              <button
                onClick={() => setView(view === 'month' ? 'list' : 'month')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                style={{
                  color: "white"
                }}
              >
                {view === 'month' ? 'List View' : 'Month View'}
              </button>
              <button
                onClick={() => {
                  setEditingTask(null);
                  setShowTaskForm(true);
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                style={{
                  color: "white"
                }}>
                Add Task
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <TaskFilter
            filters={filters}
            onFiltersChange={setFilters}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {view === 'month' ? (
          <MonthView
            tasks={filteredTasks}
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
            onTaskMove={handleTaskMove}
            onTaskResize={handleTaskResize}
            onTaskClick={(task) => {
              setEditingTask(task);
              setShowTaskForm(true);
            }}
          />
        ) : (
          <TaskList
            tasks={filteredTasks}
            onTaskEdit={(task) => {
              setEditingTask(task);
              setShowTaskForm(true);
            }}
            onTaskDelete={handleDeleteTask}
            onTaskToggleComplete={handleToggleComplete}
          />
        )}
      </div>

      {/* Task Form Modal */}
      {showTaskForm && (
        <TaskForm
          task={editingTask}
          onSave={handleSaveTask}
          onClose={() => {
            setShowTaskForm(false);
            setEditingTask(null);
          }}
        />
      )}
      <div id="w-node-_37b4dcae-9ccf-c742-095e-bf2f37278b31-7dfae354" className="kutup-footer-1">
        <div className="kutup-medium-container">      
          <div className="kutup-footer-flex">


          {showToast && (
        <div className="animate-in slide-in-from-right duration-300">
          <div className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2">
            <span className="font-medium">Contact 9902785933</span>
            <button
              onClick={() => setShowToast(false)}
              className="ml-2 text-white hover:text-gray-200 text-lg"
            >
              ×
            </button>
          </div>
        </div>
      )}
            <a href="" className="w-inline-block">
              <img
                src="logo.png"
                loading="lazy"
                width={100}
                height={100}
                alt="Logo"
              />
            </a>
            <div className="kutup-footer-horizontal-flex">
              <a href="/" className="kutup-footer-link">Home</a>
              <a href="#" className="kutup-footer-link">About</a>
              <a href="tel:9902785933" className="kutup-footer-link">Contact</a>
            </div>
            <div>
              <div className="kutup-social-wrapper-flex">
                <a href="#" className="kutup-social-link w-inline-block" onClick={handleContactClick}>
                  <img
                    src="twitter.svg"
                    loading="lazy"
                    width={20}
                    height={20}
                    alt="Twitter"
                  />
                </a>
                <a href="#" className="kutup-social-link w-inline-block" onClick={handleContactClick}>
                  <img
                    src="dribbble.svg"
                    loading="lazy"
                    width={20}
                    height={20}
                    alt="Dribbble"
                  />
                </a>
                <a href="#" className="kutup-social-link w-inline-block" onClick={handleContactClick}>
                  <img
                    src="github.svg"
                    loading="lazy"
                    width={20}
                    height={20}
                    alt="GitHub"
                  />
                </a>
                <a href="#" className="kutup-social-link w-inline-block" onClick={handleContactClick}>
                  <img
                    src="instagram.svg"
                    loading="lazy"
                    width={20}
                    height={20}
                    alt="Instagram"
                  />
                </a>
              </div>
            </div>
          </div>
          <div className="kutup-divider-60px"></div>
          <div className="kutup-copyright-center-text">
            <p className="kutup-copyright">© This design is created by Mohammad Zainulla</p>
          </div>
        </div>
      </div>
    </div>
  );
}

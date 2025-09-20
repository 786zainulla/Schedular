// Demo script to add sample tasks to the task planner
// This can be used to populate the application with sample data

const sampleTasks = [
  {
    title: 'Early Morning Workout',
    description: 'Morning exercise routine',
    date: new Date().toISOString().split('T')[0],
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0], // Single day
    time: '07:00',
    priority: 'medium',
    category: 'personal',
    completed: false
  },
  {
    title: 'Project Planning',
    description: 'Plan the new project requirements and create timeline',
    date: new Date().toISOString().split('T')[0],
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 days
    time: '09:00',
    priority: 'high',
    category: 'work',
    completed: false
  },
  {
    title: 'Team Meeting',
    description: 'Weekly team standup meeting',
    date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Tomorrow
    startDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Single day
    time: '10:30',
    priority: 'medium',
    category: 'meeting',
    completed: false
  },
  {
    title: 'Lunch Break',
    description: 'Lunch with colleagues',
    date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    startDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    time: '12:30',
    priority: 'low',
    category: 'personal',
    completed: false
  },
  {
    title: 'Code Review',
    description: 'Review pull requests and provide feedback',
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Day after tomorrow
    startDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 days
    time: '14:00',
    priority: 'high',
    category: 'work',
    completed: false
  },
  {
    title: 'Grocery Shopping',
    description: 'Buy groceries for the week',
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    startDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Single day
    time: '16:00',
    priority: 'low',
    category: 'personal',
    completed: false
  },
  {
    title: 'Evening Reading',
    description: 'Read technical articles and documentation',
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    startDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    time: '19:30',
    priority: 'medium',
    category: 'personal',
    completed: false
  },
  {
    title: 'Client Presentation',
    description: 'Prepare and deliver client presentation',
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Next week
    startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 days
    time: '11:00',
    priority: 'high',
    category: 'work',
    completed: false
  },
  {
    title: 'Conference Preparation',
    description: 'Prepare for upcoming conference',
    date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    startDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 5 days
    time: '08:00',
    priority: 'high',
    category: 'work',
    completed: false
  },
  {
    title: 'Late Night Coding',
    description: 'Work on personal projects',
    date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    startDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    time: '22:00',
    priority: 'low',
    category: 'personal',
    completed: false
  }
];

// Function to add sample tasks via API
async function addSampleTasks() {
  for (const task of sampleTasks) {
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(task),
      });
      
      if (response.ok) {
        console.log(`Added task: ${task.title}`);
      } else {
        console.error(`Failed to add task: ${task.title}`);
      }
    } catch (error) {
      console.error(`Error adding task ${task.title}:`, error);
    }
  }
}

// Export for use in browser console or as a module
if (typeof window !== 'undefined') {
  window.addSampleTasks = addSampleTasks;
} else {
  module.exports = { addSampleTasks, sampleTasks };
}

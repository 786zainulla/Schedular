import { NextResponse } from 'next/server';

// In-memory storage for tasks (in production, use a database)
let tasks = [
  {
    id: '1',
    title: 'Project Planning',
    description: 'Plan the new project requirements',
    date: '2024-01-15',
    startDate: '2024-01-15',
    endDate: '2024-01-17',
    time: '09:00',
    priority: 'high',
    category: 'work',
    completed: false,
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Team Meeting',
    description: 'Weekly team standup',
    date: '2024-01-16',
    startDate: '2024-01-16',
    endDate: '2024-01-16',
    time: '10:30',
    priority: 'medium',
    category: 'meeting',
    completed: false,
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    title: 'Code Review',
    description: 'Review pull requests',
    date: '2024-01-17',
    startDate: '2024-01-17',
    endDate: '2024-01-19',
    time: '14:00',
    priority: 'high',
    category: 'work',
    completed: false,
    createdAt: new Date().toISOString()
  }
];

// GET /api/tasks - Get all tasks
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date');
  const category = searchParams.get('category');
  const priority = searchParams.get('priority');
  const timeRange = searchParams.get('timeRange');
  const timeOfDay = searchParams.get('timeOfDay');
  const startTime = searchParams.get('startTime');
  const endTime = searchParams.get('endTime');
  
  let filteredTasks = [...tasks];
  
  if (date) {
    filteredTasks = filteredTasks.filter(task => task.date === date);
  }
  
  if (category) {
    filteredTasks = filteredTasks.filter(task => task.category === category);
  }
  
  if (priority) {
    filteredTasks = filteredTasks.filter(task => task.priority === priority);
  }
  
  // Time-based filtering
  if (timeRange) {
    filteredTasks = filteredTasks.filter(task => {
      if (!task.time) return false;
      const taskTime = task.time;
      const [hours] = taskTime.split(':').map(Number);
      
      switch (timeRange) {
        case 'morning':
          return hours >= 6 && hours < 12;
        case 'afternoon':
          return hours >= 12 && hours < 18;
        case 'evening':
          return hours >= 18 && hours < 22;
        case 'night':
          return hours >= 22 || hours < 6;
        default:
          return true;
      }
    });
  }
  
  if (timeOfDay) {
    filteredTasks = filteredTasks.filter(task => {
      if (!task.time) return false;
      const taskTime = task.time;
      const [hours] = taskTime.split(':').map(Number);
      
      switch (timeOfDay) {
        case 'early':
          return hours >= 6 && hours < 9;
        case 'morning':
          return hours >= 9 && hours < 12;
        case 'lunch':
          return hours >= 12 && hours < 14;
        case 'afternoon':
          return hours >= 14 && hours < 17;
        case 'evening':
          return hours >= 17 && hours < 20;
        case 'night':
          return hours >= 20 && hours < 23;
        default:
          return true;
      }
    });
  }
  
  if (startTime || endTime) {
    filteredTasks = filteredTasks.filter(task => {
      if (!task.time) return false;
      const taskTime = task.time;
      
      if (startTime && endTime) {
        return taskTime >= startTime && taskTime <= endTime;
      } else if (startTime) {
        return taskTime >= startTime;
      } else if (endTime) {
        return taskTime <= endTime;
      }
      return true;
    });
  }
  
  return NextResponse.json(filteredTasks);
}

// POST /api/tasks - Create a new task
export async function POST(request) {
  try {
    const body = await request.json();
    const startDate = body.startDate || body.date;
    const endDate = body.endDate || body.date;
    
    const newTask = {
      id: Date.now().toString(),
      title: body.title,
      description: body.description || '',
      date: body.date,
      startDate: startDate,
      endDate: endDate,
      time: body.time || '09:00',
      priority: body.priority || 'medium',
      category: body.category || 'general',
      completed: false,
      createdAt: new Date().toISOString()
    };
    
    tasks.push(newTask);
    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

// PUT /api/tasks - Update a task
export async function PUT(request) {
  try {
    const body = await request.json();
    const taskIndex = tasks.findIndex(task => task.id === body.id);
    
    if (taskIndex === -1) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }
    
    tasks[taskIndex] = { ...tasks[taskIndex], ...body };
    return NextResponse.json(tasks[taskIndex]);
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

// DELETE /api/tasks - Delete a task
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Task ID is required' }, { status: 400 });
    }
    
    const taskIndex = tasks.findIndex(task => task.id === id);
    
    if (taskIndex === -1) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }
    
    tasks.splice(taskIndex, 1);
    return NextResponse.json({ message: 'Task deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

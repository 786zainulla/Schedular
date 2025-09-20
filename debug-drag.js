// Debug script for drag and drop functionality
// Run this in the browser console when the app is running

function debugDragFunctionality() {
  console.log('=== Debugging Drag and Drop Functionality ===');
  
  // Check if resize handles are present
  const startHandles = document.querySelectorAll('[title="Resize start date"]');
  const endHandles = document.querySelectorAll('[title="Resize end date"]');
  
  console.log(`Found ${startHandles.length} start resize handles`);
  console.log(`Found ${endHandles.length} end resize handles`);
  
  // Check for multi-day tasks
  const multiDayTasks = document.querySelectorAll('.rounded-l, .rounded-r');
  console.log(`Found ${multiDayTasks.length} multi-day task segments`);
  
  // Check for tasks with start/end dates
  const tasks = document.querySelectorAll('[data-task-id]');
  console.log(`Found ${tasks.length} task elements`);
  
  // Test drag start on end handle
  if (endHandles.length > 0) {
    console.log('Testing end handle drag start...');
    const endHandle = endHandles[0];
    
    // Create a mock drag event
    const mockDragEvent = new DragEvent('dragstart', {
      bubbles: true,
      cancelable: true,
      dataTransfer: new DataTransfer()
    });
    
    // Add event listener to see if it triggers
    endHandle.addEventListener('dragstart', (e) => {
      console.log('✓ End handle drag start event triggered');
    });
    
    endHandle.dispatchEvent(mockDragEvent);
  } else {
    console.log('⚠ No end handles found - create a multi-day task first');
  }
  
  // Check for drag event listeners
  const dragElements = document.querySelectorAll('[draggable="true"]');
  console.log(`Found ${dragElements.length} draggable elements`);
  
  // Check for drag over handlers
  const dragOverElements = document.querySelectorAll('[onDragOver]');
  console.log(`Found ${dragOverElements.length} elements with drag over handlers`);
  
  console.log('=== Debug Complete ===');
}

// Test creating a multi-day task for testing
async function createTestMultiDayTask() {
  console.log('Creating test multi-day task...');
  
  const testTask = {
    title: 'Debug Test Task',
    description: 'Testing drag functionality',
    date: new Date().toISOString().split('T')[0],
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 4 days
    time: '10:00',
    priority: 'high',
    category: 'work'
  };
  
  try {
    const response = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testTask),
    });
    
    if (response.ok) {
      const createdTask = await response.json();
      console.log('✓ Test multi-day task created:', createdTask);
      return createdTask;
    } else {
      console.error('✗ Failed to create test task');
    }
  } catch (error) {
    console.error('✗ Error creating test task:', error);
  }
}

// Test drag end functionality
function testDragEndFunctionality() {
  console.log('Testing drag end functionality...');
  
  // Check for console logs
  const originalConsoleLog = console.log;
  const logs = [];
  
  console.log = (...args) => {
    logs.push(args.join(' '));
    originalConsoleLog(...args);
  };
  
  // Simulate drag operations
  setTimeout(() => {
    console.log = originalConsoleLog;
    
    const dragLogs = logs.filter(log => 
      log.includes('drag') || 
      log.includes('resize') || 
      log.includes('Resize') ||
      log.includes('handleTaskResize')
    );
    
    console.log(`Captured ${dragLogs.length} drag-related logs:`);
    dragLogs.forEach(log => console.log('  -', log));
  }, 2000);
  
  console.log('Drag end functionality test started...');
}

// Make functions available globally
if (typeof window !== 'undefined') {
  window.debugDragFunctionality = debugDragFunctionality;
  window.createTestMultiDayTask = createTestMultiDayTask;
  window.testDragEndFunctionality = testDragEndFunctionality;
  window.debugDragAll = async () => {
    await createTestMultiDayTask();
    debugDragFunctionality();
    testDragEndFunctionality();
  };
}

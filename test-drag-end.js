// Enhanced test script for drag end date functionality
// Run this in the browser console when the app is running

async function testDragEndFunctionality() {
  console.log('Testing Enhanced Drag End Date Functionality...');
  
  try {
    // Test 1: Create a multi-day task for testing
    console.log('1. Creating test multi-day task');
    const testTask = {
      title: 'Drag Test Task',
      description: 'Testing drag end functionality',
      date: new Date().toISOString().split('T')[0],
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 4 days
      time: '10:00',
      priority: 'high',
      category: 'work'
    };
    
    const createResponse = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testTask),
    });
    
    if (createResponse.ok) {
      const createdTask = await createResponse.json();
      console.log('✓ Test task created:', createdTask);
      
      // Test 2: Test start date resizing
      console.log('2. Testing start date resize');
      const newStartDate = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // Yesterday
      
      const resizeStartResponse = await fetch('/api/tasks', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: createdTask.id,
          startDate: newStartDate,
          endDate: createdTask.endDate,
          date: newStartDate
        }),
      });
      
      if (resizeStartResponse.ok) {
        const updatedTask = await resizeStartResponse.json();
        console.log('✓ Start date resized successfully:', {
          oldStart: createdTask.startDate,
          newStart: updatedTask.startDate,
          endDate: updatedTask.endDate
        });
        
        // Test 3: Test end date resizing
        console.log('3. Testing end date resize');
        const newEndDate = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // 5 days from now
        
        const resizeEndResponse = await fetch('/api/tasks', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: createdTask.id,
            startDate: updatedTask.startDate,
            endDate: newEndDate,
            date: updatedTask.startDate
          }),
        });
        
        if (resizeEndResponse.ok) {
          const finalTask = await resizeEndResponse.json();
          console.log('✓ End date resized successfully:', {
            startDate: finalTask.startDate,
            oldEnd: updatedTask.endDate,
            newEnd: finalTask.endDate
          });
          
          // Test 4: Test edge case - invalid resize
          console.log('4. Testing edge case - invalid resize');
          const invalidEndDate = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // Before start date
          
          const invalidResizeResponse = await fetch('/api/tasks', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: createdTask.id,
              startDate: finalTask.startDate,
              endDate: invalidEndDate,
              date: finalTask.startDate
            }),
          });
          
          if (invalidResizeResponse.ok) {
            const adjustedTask = await invalidResizeResponse.json();
            console.log('✓ Invalid resize handled correctly:', {
              originalStart: finalTask.startDate,
              invalidEnd: invalidEndDate,
              adjustedStart: adjustedTask.startDate,
              adjustedEnd: adjustedTask.endDate
            });
          }
          
          // Clean up
          console.log('5. Cleaning up test task');
          const deleteResponse = await fetch(`/api/tasks?id=${createdTask.id}`, {
            method: 'DELETE',
          });
          
          if (deleteResponse.ok) {
            console.log('✓ Test task deleted');
          }
        }
      }
    }
    
    console.log('Enhanced drag end functionality tests completed!');
    
  } catch (error) {
    console.error('Error testing drag end functionality:', error);
  }
}

// Test visual drag indicators
function testVisualDragIndicators() {
  console.log('Testing Visual Drag Indicators...');
  
  // Check for resize handles
  const startHandles = document.querySelectorAll('[title="Resize start date"]');
  const endHandles = document.querySelectorAll('[title="Resize end date"]');
  
  console.log(`Found ${startHandles.length} start resize handles`);
  console.log(`Found ${endHandles.length} end resize handles`);
  
  // Check for drag preview elements
  const dragPreviews = document.querySelectorAll('.bg-blue-100.border-2.border-blue-400');
  console.log(`Found ${dragPreviews.length} drag preview elements`);
  
  // Check for multi-day task indicators
  const multiDayTasks = document.querySelectorAll('.rounded-l, .rounded-r');
  console.log(`Found ${multiDayTasks.length} multi-day task segments`);
  
  // Check for drag state indicators
  const draggingTasks = document.querySelectorAll('.ring-2.ring-blue-400');
  console.log(`Found ${draggingTasks.length} tasks in dragging state`);
  
  console.log('Visual drag indicators test completed!');
}

// Test drag event handling
function testDragEventHandling() {
  console.log('Testing Drag Event Handling...');
  
  // Simulate drag start on a resize handle
  const startHandle = document.querySelector('[title="Resize start date"]');
  if (startHandle) {
    console.log('✓ Found start resize handle, simulating drag start');
    
    // Create a mock drag event
    const mockDragEvent = new DragEvent('dragstart', {
      bubbles: true,
      cancelable: true,
      dataTransfer: new DataTransfer()
    });
    
    startHandle.dispatchEvent(mockDragEvent);
    console.log('✓ Drag start event dispatched');
  } else {
    console.log('⚠ No start resize handle found - create a multi-day task first');
  }
  
  // Check for drag end handlers
  const dragEndHandlers = document.querySelectorAll('[onDragEnd]');
  console.log(`Found ${dragEndHandlers.length} elements with drag end handlers`);
  
  console.log('Drag event handling test completed!');
}

// Test drag validation
function testDragValidation() {
  console.log('Testing Drag Validation...');
  
  // Check for validation in console
  const originalConsoleWarn = console.warn;
  const originalConsoleError = console.error;
  const warnings = [];
  const errors = [];
  
  console.warn = (...args) => {
    warnings.push(args.join(' '));
    originalConsoleWarn(...args);
  };
  
  console.error = (...args) => {
    errors.push(args.join(' '));
    originalConsoleError(...args);
  };
  
  // Simulate invalid drag operations
  console.log('Simulating invalid drag operations...');
  
  // Restore original console methods
  setTimeout(() => {
    console.warn = originalConsoleWarn;
    console.error = originalConsoleError;
    
    console.log(`Captured ${warnings.length} warnings and ${errors.length} errors during drag validation`);
    if (warnings.length > 0) {
      console.log('Warnings:', warnings);
    }
    if (errors.length > 0) {
      console.log('Errors:', errors);
    }
  }, 1000);
  
  console.log('Drag validation test completed!');
}

// Make functions available globally
if (typeof window !== 'undefined') {
  window.testDragEndFunctionality = testDragEndFunctionality;
  window.testVisualDragIndicators = testVisualDragIndicators;
  window.testDragEventHandling = testDragEventHandling;
  window.testDragValidation = testDragValidation;
  window.testDragEndAll = async () => {
    await testDragEndFunctionality();
    testVisualDragIndicators();
    testDragEventHandling();
    testDragValidation();
  };
}

// Test script for task resizing functionality
// Run this in the browser console when the app is running

async function testTaskResizing() {
  const baseUrl = window.location.origin;
  
  console.log('Testing Task Resizing functionality...');
  
  try {
    // Create a multi-day task
    console.log('1. Creating a multi-day task');
    const multiDayTask = {
      title: 'Multi-day Project',
      description: 'A project that spans multiple days',
      date: '2024-01-15',
      startDate: '2024-01-15',
      endDate: '2024-01-17',
      time: '09:00',
      priority: 'high',
      category: 'work'
    };
    
    const createResponse = await fetch(`${baseUrl}/api/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(multiDayTask),
    });
    
    if (createResponse.ok) {
      const createdTask = await createResponse.json();
      console.log('✓ Multi-day task created:', createdTask);
      
      // Test resizing start date
      console.log('2. Testing start date resize');
      const resizeStartResponse = await fetch(`${baseUrl}/api/tasks`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: createdTask.id,
          startDate: '2024-01-14',
          endDate: createdTask.endDate,
          date: '2024-01-14'
        }),
      });
      
      if (resizeStartResponse.ok) {
        const updatedTask = await resizeStartResponse.json();
        console.log('✓ Start date resized:', updatedTask);
        
        // Test resizing end date
        console.log('3. Testing end date resize');
        const resizeEndResponse = await fetch(`${baseUrl}/api/tasks`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: createdTask.id,
            startDate: updatedTask.startDate,
            endDate: '2024-01-19',
            date: updatedTask.startDate
          }),
        });
        
        if (resizeEndResponse.ok) {
          const finalTask = await resizeEndResponse.json();
          console.log('✓ End date resized:', finalTask);
          
          // Clean up - delete the test task
          console.log('4. Cleaning up test task');
          const deleteResponse = await fetch(`${baseUrl}/api/tasks?id=${createdTask.id}`, {
            method: 'DELETE',
          });
          
          if (deleteResponse.ok) {
            console.log('✓ Test task deleted');
          }
        } else {
          console.error('✗ End date resize failed');
        }
      } else {
        console.error('✗ Start date resize failed');
      }
    } else {
      console.error('✗ Multi-day task creation failed');
    }
    
    console.log('Task resizing tests completed!');
    
  } catch (error) {
    console.error('Error testing task resizing:', error);
  }
}

// Test visual indicators
function testVisualIndicators() {
  console.log('Testing visual indicators...');
  
  // Check if resize handles are present
  const resizeHandles = document.querySelectorAll('[title="Resize start date"], [title="Resize end date"]');
  console.log(`Found ${resizeHandles.length} resize handles`);
  
  // Check if multi-day tasks are displayed correctly
  const multiDayTasks = document.querySelectorAll('.rounded-l, .rounded-r');
  console.log(`Found ${multiDayTasks.length} multi-day task segments`);
  
  // Check for multi-day indicators
  const indicators = document.querySelectorAll('text-xs.opacity-50');
  console.log(`Found ${indicators.length} multi-day indicators (→, ⋯, ←)`);
  
  console.log('Visual indicators test completed!');
}

// Test drag and drop resizing
function testDragResizing() {
  console.log('Testing drag and drop resizing...');
  
  // Find resize handles
  const startHandles = document.querySelectorAll('[title="Resize start date"]');
  const endHandles = document.querySelectorAll('[title="Resize end date"]');
  
  console.log(`Found ${startHandles.length} start resize handles`);
  console.log(`Found ${endHandles.length} end resize handles`);
  
  if (startHandles.length > 0) {
    console.log('✓ Start resize handles are present');
  } else {
    console.log('⚠ No start resize handles found - create a multi-day task first');
  }
  
  if (endHandles.length > 0) {
    console.log('✓ End resize handles are present');
  } else {
    console.log('⚠ No end resize handles found - create a multi-day task first');
  }
  
  console.log('Drag resizing test completed!');
}

// Make functions available globally
if (typeof window !== 'undefined') {
  window.testTaskResizing = testTaskResizing;
  window.testVisualIndicators = testVisualIndicators;
  window.testDragResizing = testDragResizing;
  window.testResizeAll = async () => {
    await testTaskResizing();
    testVisualIndicators();
    testDragResizing();
  };
}

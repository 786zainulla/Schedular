// Simple test script to verify API endpoints
// Run this in the browser console when the app is running

async function testTaskAPI() {
  const baseUrl = window.location.origin;
  
  console.log('Testing Task API endpoints...');
  
  try {
    // Test GET /api/tasks
    console.log('1. Testing GET /api/tasks');
    const getResponse = await fetch(`${baseUrl}/api/tasks`);
    const tasks = await getResponse.json();
    console.log('✓ GET /api/tasks successful:', tasks);
    
    // Test POST /api/tasks
    console.log('2. Testing POST /api/tasks');
    const newTask = {
      title: 'Test Task',
      description: 'This is a test task',
      date: new Date().toISOString().split('T')[0],
      time: '10:00',
      priority: 'medium',
      category: 'general'
    };
    
    const postResponse = await fetch(`${baseUrl}/api/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newTask),
    });
    
    if (postResponse.ok) {
      const createdTask = await postResponse.json();
      console.log('✓ POST /api/tasks successful:', createdTask);
      
      // Test PUT /api/tasks
      console.log('3. Testing PUT /api/tasks');
      const updatedTask = {
        ...createdTask,
        title: 'Updated Test Task',
        priority: 'high'
      };
      
      const putResponse = await fetch(`${baseUrl}/api/tasks`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTask),
      });
      
      if (putResponse.ok) {
        const updated = await putResponse.json();
        console.log('✓ PUT /api/tasks successful:', updated);
        
        // Test DELETE /api/tasks
        console.log('4. Testing DELETE /api/tasks');
        const deleteResponse = await fetch(`${baseUrl}/api/tasks?id=${createdTask.id}`, {
          method: 'DELETE',
        });
        
        if (deleteResponse.ok) {
          console.log('✓ DELETE /api/tasks successful');
        } else {
          console.error('✗ DELETE /api/tasks failed');
        }
      } else {
        console.error('✗ PUT /api/tasks failed');
      }
    } else {
      console.error('✗ POST /api/tasks failed');
    }
    
    console.log('API testing completed!');
    
  } catch (error) {
    console.error('Error testing API:', error);
  }
}

// Test filtering
async function testFiltering() {
  const baseUrl = window.location.origin;
  
  console.log('Testing filtering...');
  
  try {
    // Test category filter
    const categoryResponse = await fetch(`${baseUrl}/api/tasks?category=work`);
    const workTasks = await categoryResponse.json();
    console.log('✓ Category filter (work):', workTasks);
    
    // Test priority filter
    const priorityResponse = await fetch(`${baseUrl}/api/tasks?priority=high`);
    const highPriorityTasks = await priorityResponse.json();
    console.log('✓ Priority filter (high):', highPriorityTasks);
    
    console.log('Filtering tests completed!');
    
  } catch (error) {
    console.error('Error testing filters:', error);
  }
}

// Make functions available globally
if (typeof window !== 'undefined') {
  window.testTaskAPI = testTaskAPI;
  window.testFiltering = testFiltering;
  window.testAll = async () => {
    await testTaskAPI();
    await testFiltering();
  };
}

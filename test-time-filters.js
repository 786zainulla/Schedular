// Test script for time-based filtering functionality
// Run this in the browser console when the app is running

async function testTimeBasedFiltering() {
  const baseUrl = window.location.origin;
  
  console.log('Testing Time-Based Filtering...');
  
  try {
    // Create test tasks with different times
    const testTasks = [
      {
        title: 'Early Morning Task',
        description: 'Task scheduled for early morning',
        date: new Date().toISOString().split('T')[0],
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
        time: '07:00',
        priority: 'high',
        category: 'work'
      },
      {
        title: 'Morning Meeting',
        description: 'Team meeting in the morning',
        date: new Date().toISOString().split('T')[0],
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
        time: '10:30',
        priority: 'medium',
        category: 'meeting'
      },
      {
        title: 'Lunch Break',
        description: 'Lunch time task',
        date: new Date().toISOString().split('T')[0],
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
        time: '13:00',
        priority: 'low',
        category: 'personal'
      },
      {
        title: 'Afternoon Work',
        description: 'Afternoon work session',
        date: new Date().toISOString().split('T')[0],
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
        time: '15:30',
        priority: 'high',
        category: 'work'
      },
      {
        title: 'Evening Task',
        description: 'Evening task',
        date: new Date().toISOString().split('T')[0],
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
        time: '19:00',
        priority: 'medium',
        category: 'personal'
      },
      {
        title: 'Night Task',
        description: 'Late night task',
        date: new Date().toISOString().split('T')[0],
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
        time: '22:30',
        priority: 'low',
        category: 'work'
      }
    ];
    
    console.log('1. Creating test tasks with different times...');
    const createdTasks = [];
    
    for (const task of testTasks) {
      const response = await fetch(`${baseUrl}/api/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
      });
      
      if (response.ok) {
        const createdTask = await response.json();
        createdTasks.push(createdTask);
        console.log(`✓ Created task: ${task.title} at ${task.time}`);
      }
    }
    
    // Test 2: Time Range Filtering
    console.log('2. Testing Time Range Filtering...');
    
    const timeRanges = ['morning', 'afternoon', 'evening', 'night'];
    
    for (const timeRange of timeRanges) {
      const response = await fetch(`${baseUrl}/api/tasks?timeRange=${timeRange}`);
      const filteredTasks = await response.json();
      
      console.log(`✓ ${timeRange} filter: Found ${filteredTasks.length} tasks`);
      filteredTasks.forEach(task => {
        console.log(`  - ${task.title} at ${task.time}`);
      });
    }
    
    // Test 3: Time of Day Filtering
    console.log('3. Testing Time of Day Filtering...');
    
    const timeOfDays = ['early', 'morning', 'lunch', 'afternoon', 'evening', 'night'];
    
    for (const timeOfDay of timeOfDays) {
      const response = await fetch(`${baseUrl}/api/tasks?timeOfDay=${timeOfDay}`);
      const filteredTasks = await response.json();
      
      console.log(`✓ ${timeOfDay} filter: Found ${filteredTasks.length} tasks`);
      filteredTasks.forEach(task => {
        console.log(`  - ${task.title} at ${task.time}`);
      });
    }
    
    // Test 4: Specific Time Range Filtering
    console.log('4. Testing Specific Time Range Filtering...');
    
    const timeRanges = [
      { start: '06:00', end: '12:00', name: 'Morning (6:00-12:00)' },
      { start: '12:00', end: '18:00', name: 'Afternoon (12:00-18:00)' },
      { start: '18:00', end: '23:00', name: 'Evening (18:00-23:00)' }
    ];
    
    for (const range of timeRanges) {
      const response = await fetch(`${baseUrl}/api/tasks?startTime=${range.start}&endTime=${range.end}`);
      const filteredTasks = await response.json();
      
      console.log(`✓ ${range.name}: Found ${filteredTasks.length} tasks`);
      filteredTasks.forEach(task => {
        console.log(`  - ${task.title} at ${task.time}`);
      });
    }
    
    // Test 5: Combined Filtering
    console.log('5. Testing Combined Filtering...');
    
    const combinedResponse = await fetch(`${baseUrl}/api/tasks?timeRange=morning&priority=high&category=work`);
    const combinedTasks = await combinedResponse.json();
    
    console.log(`✓ Combined filter (morning + high priority + work): Found ${combinedTasks.length} tasks`);
    combinedTasks.forEach(task => {
      console.log(`  - ${task.title} at ${task.time} (${task.priority} priority, ${task.category})`);
    });
    
    // Clean up
    console.log('6. Cleaning up test tasks...');
    for (const task of createdTasks) {
      await fetch(`${baseUrl}/api/tasks?id=${task.id}`, {
        method: 'DELETE',
      });
    }
    console.log('✓ Test tasks cleaned up');
    
    console.log('Time-based filtering tests completed!');
    
  } catch (error) {
    console.error('Error testing time-based filtering:', error);
  }
}

// Test UI filter elements
function testTimeFilterUI() {
  console.log('Testing Time Filter UI Elements...');
  
  // Check for time filter elements
  const timeRangeFilter = document.querySelector('#time-range-filter');
  const timeOfDayFilter = document.querySelector('#time-of-day-filter');
  const startTimeFilter = document.querySelector('#start-time-filter');
  const endTimeFilter = document.querySelector('#end-time-filter');
  
  console.log(`Found time range filter: ${!!timeRangeFilter}`);
  console.log(`Found time of day filter: ${!!timeOfDayFilter}`);
  console.log(`Found start time filter: ${!!startTimeFilter}`);
  console.log(`Found end time filter: ${!!endTimeFilter}`);
  
  // Check filter options
  if (timeRangeFilter) {
    const options = Array.from(timeRangeFilter.options).map(opt => opt.value);
    console.log('Time range options:', options);
  }
  
  if (timeOfDayFilter) {
    const options = Array.from(timeOfDayFilter.options).map(opt => opt.value);
    console.log('Time of day options:', options);
  }
  
  console.log('Time filter UI test completed!');
}

// Test filter interactions
function testFilterInteractions() {
  console.log('Testing Filter Interactions...');
  
  // Test time range filter
  const timeRangeFilter = document.querySelector('#time-range-filter');
  if (timeRangeFilter) {
    console.log('Testing time range filter...');
    timeRangeFilter.value = 'morning';
    timeRangeFilter.dispatchEvent(new Event('change', { bubbles: true }));
    console.log('✓ Time range filter set to morning');
  }
  
  // Test time of day filter
  const timeOfDayFilter = document.querySelector('#time-of-day-filter');
  if (timeOfDayFilter) {
    console.log('Testing time of day filter...');
    timeOfDayFilter.value = 'early';
    timeOfDayFilter.dispatchEvent(new Event('change', { bubbles: true }));
    console.log('✓ Time of day filter set to early');
  }
  
  // Test specific time filters
  const startTimeFilter = document.querySelector('#start-time-filter');
  const endTimeFilter = document.querySelector('#end-time-filter');
  
  if (startTimeFilter && endTimeFilter) {
    console.log('Testing specific time filters...');
    startTimeFilter.value = '09:00';
    endTimeFilter.value = '17:00';
    startTimeFilter.dispatchEvent(new Event('change', { bubbles: true }));
    endTimeFilter.dispatchEvent(new Event('change', { bubbles: true }));
    console.log('✓ Time range set to 09:00-17:00');
  }
  
  console.log('Filter interactions test completed!');
}

// Make functions available globally
if (typeof window !== 'undefined') {
  window.testTimeBasedFiltering = testTimeBasedFiltering;
  window.testTimeFilterUI = testTimeFilterUI;
  window.testFilterInteractions = testFilterInteractions;
  window.testTimeFiltersAll = async () => {
    await testTimeBasedFiltering();
    testTimeFilterUI();
    testFilterInteractions();
  };
}

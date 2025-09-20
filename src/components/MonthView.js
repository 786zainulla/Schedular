'use client';

import { useState, useRef } from 'react';

const MonthView = ({ tasks, selectedDate, onDateSelect, onTaskMove, onTaskClick, onTaskResize }) => {
  const [currentDate, setCurrentDate] = useState(new Date(selectedDate));
  const [draggedTask, setDraggedTask] = useState(null);
  const [dragOverDate, setDragOverDate] = useState(null);
  const [resizingTask, setResizingTask] = useState(null);
  const [resizeEdge, setResizeEdge] = useState(null); // 'start' or 'end'
  const [dragPreview, setDragPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  // Get month and year
  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();

  // Get first day of month and number of days
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  // Generate calendar days
  const calendarDays = [];
  
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }
  
  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  // Navigate months
  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  // Get tasks for a specific date (including multi-day tasks)
  const getTasksForDate = (day) => {
    if (!day) return [];
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return tasks.filter(task => {
      const startDate = task.startDate || task.date;
      const endDate = task.endDate || task.date;
      return dateStr >= startDate && dateStr <= endDate;
    });
  };

  // Check if a task spans multiple days
  const isMultiDayTask = (task) => {
    const startDate = task.startDate || task.date;
    const endDate = task.endDate || task.date;
    return startDate !== endDate;
  };

  // Get task position within a multi-day span
  const getTaskPosition = (task, day) => {
    const startDate = task.startDate || task.date;
    const endDate = task.endDate || task.date;
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    if (dateStr === startDate) return 'start';
    if (dateStr === endDate) return 'end';
    if (dateStr > startDate && dateStr < endDate) return 'middle';
    return 'single';
  };

  // Handle drag start
  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target.outerHTML);
  };

  // Handle drag over
  const handleDragOver = (e, day) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (day) {
      setDragOverDate(day);
    }
  };

  // Handle drag leave
  const handleDragLeave = (e) => {
    setDragOverDate(null);
  };

  // Handle drop
  const handleDrop = (e, day) => {
    e.preventDefault();
    if (draggedTask && day) {
      const newDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      onTaskMove(draggedTask.id, newDate);
    }
    setDraggedTask(null);
    setDragOverDate(null);
  };

  // Handle resize start
  const handleResizeStart = (e, task, edge) => {
    e.stopPropagation();
    setResizingTask(task);
    setResizeEdge(edge);
    setIsDragging(true);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', `${task.id}-${edge}`);
    
    // Create drag preview
    const dragPreview = document.createElement('div');
    dragPreview.style.cssText = `
      position: absolute;
      top: -1000px;
      left: -1000px;
      width: 20px;
      height: 20px;
      background: #3b82f6;
      border-radius: 50%;
      pointer-events: none;
      z-index: 1000;
    `;
    document.body.appendChild(dragPreview);
    e.dataTransfer.setDragImage(dragPreview, 10, 10);
    
    // Clean up preview after a short delay
    setTimeout(() => {
      if (document.body.contains(dragPreview)) {
        document.body.removeChild(dragPreview);
      }
    }, 0);
  };

  // Handle resize over
  const handleResizeOver = (e, day) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    if (day && resizingTask && resizeEdge) {
      setDragOverDate(day);
      
      // Calculate preview date
      const newDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const startDate = resizingTask.startDate || resizingTask.date;
      const endDate = resizingTask.endDate || resizingTask.date;
      
      let previewStartDate = startDate;
      let previewEndDate = endDate;
      
      if (resizeEdge === 'start') {
        previewStartDate = newDate;
        if (previewStartDate > endDate) {
          previewEndDate = previewStartDate;
        }
      } else if (resizeEdge === 'end') {
        previewEndDate = newDate;
        if (previewEndDate < startDate) {
          previewStartDate = previewEndDate;
        }
      }
      
      setDragPreview({
        startDate: previewStartDate,
        endDate: previewEndDate,
        edge: resizeEdge
      });
    }
  };

  // Handle resize over for calendar cells
  const handleCellResizeOver = (e, day) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    if (day && resizingTask && resizeEdge) {
      setDragOverDate(day);
      
      // Calculate preview date
      const newDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const startDate = resizingTask.startDate || resizingTask.date;
      const endDate = resizingTask.endDate || resizingTask.date;
      
      let previewStartDate = startDate;
      let previewEndDate = endDate;
      
      if (resizeEdge === 'start') {
        previewStartDate = newDate;
        if (previewStartDate > endDate) {
          previewEndDate = previewStartDate;
        }
      } else if (resizeEdge === 'end') {
        previewEndDate = newDate;
        if (previewEndDate < startDate) {
          previewStartDate = previewEndDate;
        }
      }
      
      setDragPreview({
        startDate: previewStartDate,
        endDate: previewEndDate,
        edge: resizeEdge
      });
    }
  };

  // Handle resize leave
  const handleResizeLeave = (e) => {
    // Only clear if we're leaving the calendar area entirely
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDragOverDate(null);
      setDragPreview(null);
    }
  };

  // Handle resize drop
  const handleResizeDrop = (e, day) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Resize drop triggered:', { day, resizingTask, resizeEdge });
    
    if (resizingTask && day && resizeEdge) {
      const newDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      
      console.log('Resizing task:', {
        taskId: resizingTask.id,
        edge: resizeEdge,
        newDate,
        currentStart: resizingTask.startDate || resizingTask.date,
        currentEnd: resizingTask.endDate || resizingTask.date
      });
      
      // Validate the resize operation
      const startDate = resizingTask.startDate || resizingTask.date;
      const endDate = resizingTask.endDate || resizingTask.date;
      
      let isValidResize = true;
      
      if (resizeEdge === 'start' && newDate > endDate) {
        isValidResize = false;
        console.warn('Invalid start date: cannot be after end date');
      } else if (resizeEdge === 'end' && newDate < startDate) {
        isValidResize = false;
        console.warn('Invalid end date: cannot be before start date');
      }
      
      if (isValidResize) {
        console.log('Calling onTaskResize with:', resizingTask.id, resizeEdge, newDate);
        onTaskResize(resizingTask.id, resizeEdge, newDate);
      } else {
        console.warn('Invalid resize operation: date constraints not met');
      }
    } else {
      console.log('Resize drop conditions not met:', { resizingTask: !!resizingTask, day, resizeEdge });
    }
    
    // Clean up state
    setResizingTask(null);
    setResizeEdge(null);
    setDragOverDate(null);
    setDragPreview(null);
    setIsDragging(false);
  };

  // Handle drag end (cleanup)
  const handleDragEnd = (e) => {
    setResizingTask(null);
    setResizeEdge(null);
    setDragOverDate(null);
    setDragPreview(null);
    setIsDragging(false);
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 border-red-300 text-red-800';
      case 'medium': return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      case 'low': return 'bg-green-100 border-green-300 text-green-800';
      default: return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  // Get category color
  const getCategoryColor = (category) => {
    switch (category) {
      case 'work': return 'bg-blue-50 border-blue-200';
      case 'meeting': return 'bg-purple-50 border-purple-200';
      case 'personal': return 'bg-pink-50 border-pink-200';
      case 'urgent': return 'bg-red-50 border-red-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Calendar Header */}
      <div className="flex items-center justify-between p-6 border-b">
        <h2 className="text-2xl font-bold text-gray-900">
          {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={() => navigateMonth(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            style={{
              color: "white"}}
              
              
              >
            Today
          </button>
          <button
            onClick={() => navigateMonth(1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Drag Preview Overlay */}
      {dragPreview && (
        <div className="absolute inset-0 pointer-events-none z-10">
          <div className="bg-blue-100 border-2 border-blue-400 rounded-lg p-2 m-2 shadow-lg">
            <div className="text-xs font-medium text-blue-800">
              {resizeEdge === 'start' ? 'New Start Date:' : 'New End Date:'} {dragPreview[resizeEdge === 'start' ? 'startDate' : 'endDate']}
            </div>
            <div className="text-xs text-blue-600">
              Duration: {Math.ceil((new Date(dragPreview.endDate) - new Date(dragPreview.startDate)) / (1000 * 60 * 60 * 24)) + 1} days
            </div>
          </div>
        </div>
      )}

      {/* Calendar Grid */}
      <div className="grid grid-cols-7">
        {/* Day headers */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="p-4 text-center font-semibold text-gray-600 bg-gray-50 border-b">
            {day}
          </div>
        ))}

        {/* Calendar days */}
        {calendarDays.map((day, index) => {
          const dayTasks = getTasksForDate(day);
          const isToday = day && new Date().toDateString() === new Date(year, month, day).toDateString();
          const isSelected = day && `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}` === selectedDate;

          return (
            <div
              key={index}
              className={`min-h-[120px] p-2 border-r border-b border-gray-200 ${
                day ? 'bg-white hover:bg-gray-50' : 'bg-gray-50'
              } ${isToday ? 'bg-blue-50' : ''} ${isSelected ? 'bg-blue-100' : ''} ${
                dragOverDate === day && resizingTask ? 'bg-blue-100 ring-2 ring-blue-400' : ''
              }`}
              onDragOver={(e) => {
                handleDragOver(e, day);
                handleCellResizeOver(e, day);
              }}
              onDragLeave={handleDragLeave}
              onDrop={(e) => {
                handleDrop(e, day);
                handleResizeDrop(e, day);
              }}
            >
              {day && (
                <>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm font-medium ${isToday ? 'text-blue-600' : 'text-gray-900'}`}>
                      {day}
                    </span>
                    {isToday && (
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    )}
                  </div>
                  
                  <div className="space-y-1">
                    {dayTasks.slice(0, 3).map(task => {
                      const taskPosition = getTaskPosition(task, day);
                      const isMultiDay = isMultiDayTask(task);
                      const isStart = taskPosition === 'start';
                      const isEnd = taskPosition === 'end';
                      const isMiddle = taskPosition === 'middle';
                      
                      return (
                        <div
                          key={`${task.id}-${day}`}
                          draggable
                          onDragStart={(e) => handleDragStart(e, task)}
                          onDragEnd={handleDragEnd}
                          onClick={() => onTaskClick(task)}
                          onDragOver={(e) => handleResizeOver(e, day)}
                          onDragLeave={handleResizeLeave}
                          onDrop={(e) => handleResizeDrop(e, day)}
                          className={`relative p-1 text-xs cursor-pointer transition-all hover:shadow-sm ${
                            getPriorityColor(task.priority)
                          } ${getCategoryColor(task.category)} ${
                            task.completed ? 'opacity-60 line-through' : ''
                          } ${
                            isMultiDay ? 'rounded-none' : 'rounded'
                          } ${
                            isStart && isMultiDay ? 'rounded-l' : ''
                          } ${
                            isEnd && isMultiDay ? 'rounded-r' : ''
                          } ${
                            isMiddle && isMultiDay ? 'rounded-none' : ''
                          } ${
                            isDragging && resizingTask?.id === task.id ? 'ring-2 ring-blue-400' : ''
                          }`}
                        >
                          {/* Resize handles for multi-day tasks */}
                          {isMultiDay && (
                            <>
                              {isStart && (
                                <div
                                  draggable={true}
                                  onDragStart={(e) => {
                                    console.log('Start resize drag started');
                                    handleResizeStart(e, task, 'start');
                                  }}
                                  onDragEnd={(e) => {
                                    console.log('Start resize drag ended');
                                    handleDragEnd(e);
                                  }}
                                  className={`absolute left-0 top-0 bottom-0 w-3 cursor-ew-resize transition-all ${
                                    isDragging && resizingTask?.id === task.id && resizeEdge === 'start'
                                      ? 'bg-blue-600 opacity-100'
                                      : 'bg-blue-400 hover:bg-blue-600 opacity-0 hover:opacity-100'
                                  }`}
                                  title="Resize start date"
                                  style={{ zIndex: 10 }}
                                >
                                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-4 bg-white rounded-full shadow-sm"></div>
                                </div>
                              )}
                              {isEnd && (
                                <div
                                  draggable={true}
                                  onDragStart={(e) => {
                                    console.log('End resize drag started');
                                    handleResizeStart(e, task, 'end');
                                  }}
                                  onDragEnd={(e) => {
                                    console.log('End resize drag ended');
                                    handleDragEnd(e);
                                  }}
                                  className={`absolute right-0 top-0 bottom-0 w-3 cursor-ew-resize transition-all ${
                                    isDragging && resizingTask?.id === task.id && resizeEdge === 'end'
                                      ? 'bg-blue-600 opacity-100'
                                      : 'bg-blue-400 hover:bg-blue-600 opacity-0 hover:opacity-100'
                                  }`}
                                  title="Resize end date"
                                  style={{ zIndex: 10 }}
                                >
                                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-4 bg-white rounded-full shadow-sm"></div>
                                </div>
                              )}
                            </>
                          )}
                          
                          <div className="font-medium truncate">
                            {isStart || !isMultiDay ? task.title : ''}
                          </div>
                          {task.time && (isStart || !isMultiDay) && (
                            <div className="text-xs opacity-75">{task.time}</div>
                          )}
                          
                          {/* Multi-day indicator */}
                          {isMultiDay && (
                            <div className="text-xs opacity-50">
                              {isStart && '→'}
                              {isMiddle && '⋯'}
                              {isEnd && '←'}
                            </div>
                          )}
                        </div>
                      );
                    })}
                    {dayTasks.length > 3 && (
                      <div className="text-xs text-gray-500">
                        +{dayTasks.length - 3} more
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MonthView;

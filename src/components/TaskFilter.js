'use client';

const TaskFilter = ({ filters, onFiltersChange }) => {
  const handleFilterChange = (key, value) => {
    onFiltersChange(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    onFiltersChange({
      category: '',
      priority: '',
      completed: '',
      timeRange: '',
      timeOfDay: '',
      startTime: '',
      endTime: ''
    });
  };

  const hasActiveFilters = filters.category || filters.priority || filters.completed !== '' || 
                          filters.timeRange || filters.timeOfDay || filters.startTime || filters.endTime;

  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="flex items-center space-x-2">
        <label htmlFor="category-filter" className="text-sm font-medium text-gray-700">
          Category:
        </label>
        <select
          id="category-filter"
          value={filters.category}
          onChange={(e) => handleFilterChange('category', e.target.value)}
          className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">All Categories</option>
          <option value="general">General</option>
          <option value="work">Work</option>
          <option value="meeting">Meeting</option>
          <option value="personal">Personal</option>
          <option value="urgent">Urgent</option>
        </select>
      </div>

      <div className="flex items-center space-x-2">
        <label htmlFor="priority-filter" className="text-sm font-medium text-gray-700">
          Priority:
        </label>
        <select
          id="priority-filter"
          value={filters.priority}
          onChange={(e) => handleFilterChange('priority', e.target.value)}
          className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <div className="flex items-center space-x-2">
        <label htmlFor="status-filter" className="text-sm font-medium text-gray-700">
          Status:
        </label>
        <select
          id="status-filter"
          value={filters.completed}
          onChange={(e) => handleFilterChange('completed', e.target.value)}
          className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">All Tasks</option>
          <option value="false">Pending</option>
          <option value="true">Completed</option>
        </select>
      </div>

      <div className="flex items-center space-x-2">
        <label htmlFor="time-range-filter" className="text-sm font-medium text-gray-700">
          Time Range:
        </label>
        <select
          id="time-range-filter"
          value={filters.timeRange}
          onChange={(e) => handleFilterChange('timeRange', e.target.value)}
          className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">All Times</option>
          <option value="morning">Morning (6:00-12:00)</option>
          <option value="afternoon">Afternoon (12:00-18:00)</option>
          <option value="evening">Evening (18:00-22:00)</option>
          <option value="night">Night (22:00-6:00)</option>
        </select>
      </div>

      <div className="flex items-center space-x-2">
        <label htmlFor="time-of-day-filter" className="text-sm font-medium text-gray-700">
          Time of Day:
        </label>
        <select
          id="time-of-day-filter"
          value={filters.timeOfDay}
          onChange={(e) => handleFilterChange('timeOfDay', e.target.value)}
          className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Any Time</option>
          <option value="early">Early (6:00-9:00)</option>
          <option value="morning">Morning (9:00-12:00)</option>
          <option value="lunch">Lunch (12:00-14:00)</option>
          <option value="afternoon">Afternoon (14:00-17:00)</option>
          <option value="evening">Evening (17:00-20:00)</option>
          <option value="night">Night (20:00-23:00)</option>
        </select>
      </div>

      <div className="flex items-center space-x-2">
        <label htmlFor="start-time-filter" className="text-sm font-medium text-gray-700">
          From:
        </label>
        <input
          type="time"
          id="start-time-filter"
          value={filters.startTime}
          onChange={(e) => handleFilterChange('startTime', e.target.value)}
          className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="flex items-center space-x-2">
        <label htmlFor="end-time-filter" className="text-sm font-medium text-gray-700">
          To:
        </label>
        <input
          type="time"
          id="end-time-filter"
          value={filters.endTime}
          onChange={(e) => handleFilterChange('endTime', e.target.value)}
          className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 transition-colors"
        >
          Clear Filters
        </button>
      )}
    </div>
  );
};

export default TaskFilter;

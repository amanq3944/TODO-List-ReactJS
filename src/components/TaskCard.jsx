function TaskCard({ task, onToggle, onDelete, onEdit }) {
  const getPriorityColor = () => {
    switch (task.priority) {
      case "high": return "bg-red-100 text-red-800 border-red-300";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "low": return "bg-blue-100 text-blue-800 border-blue-300";
      default: return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getStatusColor = () => {
    return task.status === "Completed" 
      ? "bg-green-100 text-green-800 border-green-300" 
      : "bg-orange-100 text-orange-800 border-orange-300";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-4 transition-all duration-200 hover:shadow-lg border-l-4 ${
      task.status === "Completed" ? "border-green-500" : "border-blue-500"
    }`}>
      {/* Header with title and priority */}
      <div className="flex justify-between items-start mb-3">
        <h3 className={`text-lg font-semibold truncate max-w-[70%] ${
          task.status === "Completed" ? "line-through text-gray-500" : "text-gray-800"
        }`}>
          {task.title}
        </h3>
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${getPriorityColor()}`}>
          {task.priority}
        </span>
      </div>
      
      {/* Description */}
      {task.description && (
        <p className={`text-gray-600 mb-4 text-sm ${
          task.status === "Completed" ? "line-through" : ""
        }`}>
          {task.description}
        </p>
      )}
      
      {/* Metadata */}
      <div className="flex justify-between items-center text-xs text-gray-500 mb-4">
        <div className="flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>Created: {formatDate(task.createdAt)}</span>
        </div>
        
        {task.status === "Completed" && task.completedAt && (
          <div className="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Completed: {formatDate(task.completedAt)}</span>
          </div>
        )}
      </div>
      
      {/* Footer with status and actions */}
      <div className="flex justify-between items-center">
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor()}`}>
          {task.status}
        </span>
        
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-colors"
            title="Edit task"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          
          <button
            onClick={onToggle}
            className={`p-2 rounded-full transition-colors ${
              task.status === "Completed" 
                ? "text-gray-600 hover:bg-gray-100" 
                : "text-green-600 hover:bg-green-100"
            }`}
            title={task.status === "Completed" ? "Mark as pending" : "Mark as complete"}
          >
            {task.status === "Completed" ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>
          
          <button
            onClick={onDelete}
            className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-colors"
            title="Delete task"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default TaskCard;
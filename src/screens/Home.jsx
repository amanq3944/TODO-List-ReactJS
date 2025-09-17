import { useEffect, useState } from "react";

// TaskCard Component
function TaskCard({ task, onToggle, onDelete, onEdit }) {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800 border-red-200";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low": return "bg-blue-100 text-blue-800 border-blue-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow p-4 border-l-4 ${task.status === "Completed" ? "border-green-500" : "border-gray-500"}`}>
      <div className="flex justify-between items-start mb-2">
        <h3 className={`text-lg font-semibold ${task.status === "Completed" ? "line-through text-gray-500" : "text-gray-800"}`}>
          {task.title}
        </h3>
        <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
          {task.priority}
        </span>
      </div>
      
      {task.description && (
        <p className={`text-gray-600 mb-3 ${task.status === "Completed" ? "line-through" : ""}`}>
          {task.description}
        </p>
      )}
      
      <div className="flex justify-between items-center text-sm text-gray-500">
        <span>Created: {new Date(task.createdAt).toLocaleDateString()}</span>
        {task.status === "Completed" && task.completedAt && (
          <span>Completed: {new Date(task.completedAt).toLocaleDateString()}</span>
        )}
      </div>
      
      <div className="flex justify-end gap-2 mt-4">
        <button
          onClick={onEdit}
          className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
        >
          Edit
        </button>
        <button
          onClick={onToggle}
          className={`px-3 py-1 rounded-md transition-colors ${task.status === "Completed" 
            ? "bg-gray-100 text-gray-700 hover:bg-gray-200" 
            : "bg-green-100 text-green-700 hover:bg-green-200"}`}
        >
          {task.status === "Completed" ? "Mark Pending" : "Mark Complete"}
        </button>
        <button
          onClick={onDelete}
          className="px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

// TaskForm Component
function TaskForm({ onSubmit, onCancel, task }) {
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [priority, setPriority] = useState(task?.priority || "medium");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    onSubmit({
      title: title.trim(),
      description: description.trim(),
      priority,
      status: task?.status || "Pending",
      id: task?.id || null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="p-6">
      <h2 className="text-xl font-bold mb-4">{task ? "Edit Task" : "Add New Task"}</h2>
      
      <div className="mb-4">
        <label className="block text-gray-700 mb-2" htmlFor="title">
          Title *
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Task title"
          required
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700 mb-2" htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Task description"
          rows="3"
        />
      </div>
      
      <div className="mb-6">
        <label className="block text-gray-700 mb-2" htmlFor="priority">
          Priority
        </label>
        <select
          id="priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
      
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          {task ? "Update Task" : "Add Task"}
        </button>
      </div>
    </form>
  );
}

// Main Home Component
function Home() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all"); // all, pending, completed
  const [sortBy, setSortBy] = useState("newest"); // newest, oldest, priority
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("tasks");
    if (saved) setTasks(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (taskData) => {
    const newTask = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      status: "Pending"
    };
    setTasks([...tasks, newTask]);
    setShowForm(false);
  };

  const updateTask = (updatedTaskData) => {
    const updatedTasks = tasks.map(t => 
      t.id === updatedTaskData.id ? {
        ...t,
        title: updatedTaskData.title,
        description: updatedTaskData.description,
        priority: updatedTaskData.priority
      } : t
    );
    setTasks(updatedTasks);
    setEditingTask(null);
  };

  const toggleStatus = (id) => {
    const updated = tasks.map(t =>
      t.id === id ? { 
        ...t, 
        status: t.status === "Pending" ? "Completed" : "Pending",
        completedAt: t.status === "Pending" ? new Date().toISOString() : null
      } : t
    );
    setTasks(updated);
  };

  const deleteTask = (id) => {
    const updated = tasks.filter(t => t.id !== id);
    setTasks(updated);
  };

  const clearCompleted = () => {
    const updated = tasks.filter(t => t.status !== "Completed");
    setTasks(updated);
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === "completed") return task.status === "Completed";
    if (filter === "pending") return task.status === "Pending";
    return true;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortBy === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
    if (sortBy === "priority") {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }
    return 0;
  });

  const pendingCount = tasks.filter(t => t.status === "Pending").length;
  const completedCount = tasks.filter(t => t.status === "Completed").length;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">My Tasks</h1>
        <p className="text-gray-600">Stay organized and productive</p>
      </header>

      {/* Stats Overview */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold">{tasks.length}</p>
            <p className="text-gray-600">Total Tasks</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{pendingCount}</p>
            <p className="text-gray-600">Pending</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{completedCount}</p>
            <p className="text-gray-600">Completed</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex flex-wrap gap-2">
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Tasks</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
          
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="priority">By Priority</option>
          </select>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Add Task
          </button>
          
          {completedCount > 0 && (
            <button 
              onClick={clearCompleted}
              className="px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
            >
              Clear Completed
            </button>
          )}
        </div>
      </div>

      {/* Task List */}
      {sortedTasks.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500 mb-4">
            {filter === "completed" 
              ? "No completed tasks yet." 
              : filter === "pending" 
                ? "No pending tasks. Great job!" 
                : "No tasks yet. Add one to get started!"}
          </p>
          {filter !== "completed" && (
            <button 
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Add Your First Task
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {sortedTasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onToggle={() => toggleStatus(task.id)}
              onDelete={() => deleteTask(task.id)}
              onEdit={() => setEditingTask(task)}
            />
          ))}
        </div>
      )}

      {/* Task Form Modal */}
      {(showForm || editingTask) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <TaskForm
              onSubmit={editingTask ? updateTask : addTask}
              onCancel={() => {
                setShowForm(false);
                setEditingTask(null);
              }}
              task={editingTask}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
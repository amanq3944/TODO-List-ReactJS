import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddTask() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    
    if (!title.trim()) {
      newErrors.title = "Title is required";
    } else if (title.length > 100) {
      newErrors.title = "Title must be less than 100 characters";
    }
    
    if (description.length > 500) {
      newErrors.description = "Description must be less than 500 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    const newTask = {
      id: Date.now().toString(),
      title: title.trim(),
      description: description.trim(),
      priority,
      status: "Pending",
      createdAt: new Date().toISOString()
    };

    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const updatedTasks = [...savedTasks, newTask];
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    
    // Simulate a small delay for better UX
    setTimeout(() => {
      setIsSubmitting(false);
      navigate("/");
    }, 500);
  };

  const handleCancel = () => {
    if (title || description) {
      const confirm = window.confirm("Are you sure you want to cancel? Your changes will be lost.");
      if (confirm) navigate("/");
    } else {
      navigate("/");
    }
  };

  const characterCount = description.length;
  const maxDescriptionChars = 500;

  return (
    <div className="max-w-md mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-blue-600 p-4 text-white">
          <h1 className="text-2xl font-bold">Add New Task</h1>
          <p className="text-blue-100">Create a new task to stay organized</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-5">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Task Title *
            </label>
            <input
              id="title"
              type="text"
              placeholder="Enter task title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.title ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
              }`}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title}</p>
            )}
          </div>
          
          <div className="mb-5">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              placeholder="Enter task description (optional)"
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={4}
              className={`w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.description ? "border-red-500 focus:ring-red-500" : ""
              }`}
            />
            <div className="flex justify-between mt-1">
              <div>
                {errors.description && (
                  <p className="text-sm text-red-600">{errors.description}</p>
                )}
              </div>
              <p className={`text-xs ${characterCount > maxDescriptionChars ? 'text-red-600' : 'text-gray-500'}`}>
                {characterCount}/{maxDescriptionChars}
              </p>
            </div>
          </div>
          
          <div className="mb-6">
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              id="priority"
              value={priority}
              onChange={e => setPriority(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                "Save Task"
              )}
            </button>
          </div>
        </form>
      </div>
      
      <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-100">
        <h2 className="font-medium text-blue-800 mb-2">Tips for effective tasks:</h2>
        <ul className="text-sm text-blue-700 list-disc pl-5 space-y-1">
          <li>Use clear and specific titles</li>
          <li>Break large tasks into smaller ones</li>
          <li>Set priorities to focus on what's important</li>
        </ul>
      </div>
    </div>
  );
}

export default AddTask;
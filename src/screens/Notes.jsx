import { useState, useEffect } from "react";

function Notes() {
  const [notes, setNotes] = useState([]);
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("personal");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [editMode, setEditMode] = useState(null);
  const [editText, setEditText] = useState("");
  const [editTitle, setEditTitle] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("notes");
    if (saved) setNotes(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  const addNote = () => {
    if (!text.trim()) return;
    
    const newNote = {
      id: Date.now(),
      title: title.trim() || "Untitled Note",
      text: text.trim(),
      category,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const newNotes = [...notes, newNote];
    setNotes(newNotes);
    setText("");
    setTitle("");
    setCategory("personal");
  };

  const deleteNote = (id) => {
    const newNotes = notes.filter(note => note.id !== id);
    setNotes(newNotes);
  };

  const startEdit = (note) => {
    setEditMode(note.id);
    setEditText(note.text);
    setEditTitle(note.title);
  };

  const saveEdit = () => {
    const newNotes = notes.map(note => 
      note.id === editMode 
        ? { 
            ...note, 
            text: editText.trim(), 
            title: editTitle.trim() || "Untitled Note",
            updatedAt: new Date().toISOString()
          }
        : note
    );
    
    setNotes(newNotes);
    setEditMode(null);
    setEditText("");
    setEditTitle("");
  };

  const cancelEdit = () => {
    setEditMode(null);
    setEditText("");
    setEditTitle("");
  };

  const categories = ["personal", "work", "ideas", "tasks", "important"];
  
  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.text.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          note.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || note.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (cat) => {
    switch (cat) {
      case "work": return "bg-blue-100 text-blue-800";
      case "ideas": return "bg-purple-100 text-purple-800";
      case "tasks": return "bg-green-100 text-green-800";
      case "important": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Notes</h1>
        <p className="text-gray-600">Capture your thoughts and ideas</p>
      </header>

      {/* Add Note Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Add New Note</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title (optional)</label>
            <input
              type="text"
              placeholder="Note title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Note Content</label>
          <textarea
            placeholder="Write your note here..."
            value={text}
            onChange={e => setText(e.target.value)}
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <button 
          onClick={addNote} 
          disabled={!text.trim()}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Add Note
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Search Notes</label>
            <input
              type="text"
              placeholder="Search by title or content..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Category</label>
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Notes List */}
      <div>
        <h2 className="text-xl font-semibold mb-4">
          Your Notes {filteredNotes.length > 0 && `(${filteredNotes.length})`}
        </h2>
        
        {filteredNotes.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-500 mb-4">
              {notes.length === 0 
                ? "You don't have any notes yet. Add one above to get started!" 
                : "No notes match your search criteria."}
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredNotes.map(note => (
              <div key={note.id} className="bg-white rounded-lg shadow-md p-5">
                {editMode === note.id ? (
                  <div className="mb-4">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={e => setEditTitle(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded mb-3 font-semibold text-lg"
                    />
                    <textarea
                      value={editText}
                      onChange={e => setEditText(e.target.value)}
                      rows={4}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                    <div className="flex gap-2 mt-3">
                      <button 
                        onClick={saveEdit}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                      >
                        Save
                      </button>
                      <button 
                        onClick={cancelEdit}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-gray-800">{note.title}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(note.category)}`}>
                        {note.category}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 whitespace-pre-line mb-4">{note.text}</p>
                    
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span>Created: {formatDate(note.createdAt)}</span>
                      {note.updatedAt !== note.createdAt && (
                        <span>Updated: {formatDate(note.updatedAt)}</span>
                      )}
                    </div>
                    
                    <div className="flex justify-end gap-2 mt-4">
                      <button
                        onClick={() => startEdit(note)}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteNote(note.id)}
                        className="px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Notes;
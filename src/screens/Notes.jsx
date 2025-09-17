import { useState, useEffect } from "react";

function Notes() {
  const [notes, setNotes] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("notes");
    if (saved) setNotes(JSON.parse(saved));
  }, []);

  const addNote = () => {
    if (!text.trim()) return;
    const newNotes = [...notes, { id: Date.now(), text }];
    setNotes(newNotes);
    localStorage.setItem("notes", JSON.stringify(newNotes));
    setText("");
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Notes</h1>
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Write a note..."
          value={text}
          onChange={e => setText(e.target.value)}
          className="border flex-1 p-2 rounded"
        />
        <button onClick={addNote} className="px-4 bg-blue-500 text-white rounded">
          Add
        </button>
      </div>
      <ul className="space-y-2">
        {notes.map(n => (
          <li key={n.id} className="bg-white shadow p-3 rounded">
            {n.text}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Notes;

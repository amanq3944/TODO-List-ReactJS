import { Routes, Route, NavLink } from "react-router-dom";
import Home from "./screens/Home";
// import AddTask from "./screens/AddTask";
import Notes from "./screens/Notes";

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md flex gap-6 px-6 py-3 sticky top-0">
        <NavLink to="/" className="font-semibold" end>
          Tasks
        </NavLink>
        {/* <NavLink to="/add">Add Task</NavLink> */}
        <NavLink to="/notes">Notes</NavLink>
      </nav>

      <div className="p-6 max-w-3xl mx-auto">
        <Routes>
          <Route path="/" element={<Home />} />
          {/* <Route path="/add" element={<AddTask />} /> */}
          <Route path="/notes" element={<Notes />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;

import {
  getTasks,
  addTask as addTaskService,
  updateTask,
  deleteTask as deleteTaskService,
} from "../services/taskService";
import logo from "../assets/logo.png";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import TaskItem from "./TaskItem";
import TaskModal from "./TaskModal";
import { useNavigate } from "react-router-dom";
import SidebarFooter from "./SidebarFooter";

import {
  Sun,
  Infinity,
  CheckCircle2,
  ListTodo,
  Plus,
  Search,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const { token, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("desc");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const fetchAllTasks = async () => {
    try {
      const data = await getTasks(token, {
        status: filterStatus,
        search: debouncedSearch,
        sortBy,
        sortOrder,
        page,
        limit,
      });
      setTasks(data.tasks);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    fetchAllTasks();
  }, [token, page, debouncedSearch, filterStatus, sortBy, sortOrder]);

  const addTask = async (title, description) => {
    const tempId = Date.now();
    const optimisticTask = {
      id: tempId,
      title,
      description,
      status: "pending",
      optimistic: true,
    };
    setTasks((prev) => [optimisticTask, ...prev]);

    try {
      const savedTask = await addTaskService(
        { title, description, status: "pending" },
        token
      );
      setTasks((prev) =>
        prev.map((task) => (task.id === tempId ? savedTask : task))
      );
      if (tasks.length + 1 > limit) fetchAllTasks();
    } catch (error) {
      console.error(error.message);
      setTasks((prev) => prev.filter((task) => task.id !== tempId));
    }
  };

  const toggleTask = async (id) => {
    const task = tasks.find((t) => t.id === id);
    const newStatus = task.status === "completed" ? "pending" : "completed";

    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
    );

    try {
      const updatedTask = await updateTask(
        id,
        { title: task.title, description: task.description, status: newStatus },
        token
      );
      setTasks((prev) =>
        prev.map((task) => (task.id === id ? updatedTask : task))
      );
    } catch (error) {
      console.error("Failed to update task", error.message);
    }
  };

  const deleteTask = async (id) => {
    const backup = tasks;
    setTasks((prev) => prev.filter((task) => task.id !== id));
    try {
      await deleteTaskService(id, token);
      if (tasks.length + 1 > limit) fetchAllTasks();
    } catch (error) {
      console.error(error.message);
      setTasks(backup);
    }
  };

  const startEdit = (task) => {
    setEditId(task.id);
    setEditTitle(task.title);
  };

  const saveEdit = async (id) => {
    const oldTask = tasks.find((t) => t.id === id);
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, title: editTitle } : task))
    );
    setEditId(null);
    setEditTitle("");
    try {
      const updatedTask = await updateTask(id, { title: editTitle }, token);
      setTasks((prev) =>
        prev.map((task) => (task.id === id ? updatedTask : task))
      );
    } catch (error) {
      console.error(error.message);
      setTasks((prev) => prev.map((task) => (task.id === id ? oldTask : task)));
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-sm flex flex-col">
        <div className="px-6 py-2 text-xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-sm">
          <img src={logo} alt="App Logo" className="h-7 p-0.5" />
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setFilterStatus("")}
            className="flex items-center gap-2 w-full px-3 py-2 rounded hover:bg-gray-100 text-left"
          >
            <Infinity size={18} /> All
          </button>
          <button
            onClick={() => setFilterStatus("pending")}
            className="flex items-center gap-2 w-full px-3 py-2 rounded hover:bg-gray-100 text-left"
          >
            <ListTodo size={18} /> Pending
          </button>
          <button
            onClick={() => setFilterStatus("completed")}
            className="flex items-center gap-2 w-full px-3 py-2 rounded hover:bg-gray-100 text-left"
          >
            <CheckCircle2 size={18} /> Completed
          </button>
          <button className="flex items-center gap-2 w-full px-3 py-2 rounded hover:bg-gray-100 text-left">
            <Sun size={18} /> Upcoming
          </button>
        </nav>
        <SidebarFooter handleLogout={handleLogout} />
      </aside>

      <main className="flex-1 flex flex-col">
        <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 py-2 shadow-md flex justify-between items-center">
          <div className="relative w-1/3 max-w-sm">
            <Search className="absolute left-2 top-1.5 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="w-full pl-8 pr-2 py-1 text-sm bg-white text-gray-800 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="font-semibold text-gray-100">
            Hello, {user?.name || "User"} 👋
          </div>
        </header>

        <div className="flex items-center justify-between px-6 py-2 bg-gray-50 shadow-sm">
          <div className="flex items-center gap-3">
            <ArrowUpDown size={18} className="text-gray-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="p-1.5 rounded-md border border-gray-300 py-1 text-sm cursor-pointer"
            >
              <option value="created_at">Date</option>
              <option value="title">Title</option>
              <option value="status">Status</option>
            </select>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="p-1.5 rounded-md border border-gray-300 py-1 text-sm cursor-pointer"
            >
              <option value="asc">Asc</option>
              <option value="desc">Desc</option>
            </select>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-1.5 rounded-md hover:bg-blue-700 transition text-sm cursor-pointer"
          >
            <Plus size={16} /> Add Task
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
          {tasks.length === 0 ? (
            <p className="text-gray-500">No tasks yet. Add some!</p>
          ) : (
            <ul className="space-y-3">
              {tasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  toggleTask={toggleTask}
                  startEdit={startEdit}
                  saveEdit={saveEdit}
                  deleteTask={deleteTask}
                  editId={editId}
                  editTitle={editTitle}
                  setEditTitle={setEditTitle}
                />
              ))}
            </ul>
          )}
        </div>

        <div className="px-6 py-3 flex justify-center items-center gap-2 border-t border-gray-200 bg-white">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="p-1.5 rounded-md border border-gray-200 disabled:opacity-50 hover:bg-gray-50"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-xs text-gray-600">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="p-1.5 rounded-md border border-gray-200 disabled:opacity-50 hover:bg-gray-50"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </main>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={addTask}
      />
    </div>
  );
}

import {
  getTasks,
  addTask as addTaskService,
  updateTask,
  deleteTask as deleteTaskService,
} from "../services/taskService";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext"; 

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [editId, setEditId] = useState(null); 
  const [editTitle, setEditTitle] = useState("");
  const { token } = useContext(AuthContext);

  // Fetch tasks
  useEffect(() => {
    const fetchAllTasks = async () => {
      try {
        const data = await getTasks(token);
        setTasks(data);
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchAllTasks();
  }, [token]);

  // Add task
  const addTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    const tempId = Date.now();
    const optimisticTask = {
      id: tempId,
      title: newTask,
      description: "",
      status: "pending",
      optimistic: true,
    };
    setTasks((prev) => [optimisticTask, ...prev]); // add at top
    setNewTask("");

    try {
      const savedTask = await addTaskService(
        {
          title: newTask,
          description: "",
          status: "pending",
        },
        token
      );

     setTasks((prev) =>
        prev.map((task) => (task.id === tempId ? savedTask : task))
      );
    } catch (error) {
            console.error(error.message);
     setTasks((prev) => prev.filter((task) => task.id !== tempId));
    }
  };

  // Toggle task status
  const toggleTask = async (id) => {
  const task = tasks.find((t) => t.id === id);
  const newStatus = task.status === "completed" ? "pending" : "completed";

  // Optimistic update
  setTasks((prev) =>
    prev.map((t) =>
      t.id === id ? { ...t, status: newStatus } : t
    )
  );

  try {
    const updatedTask = await updateTask(
      id,
      { 
        title: task.title,           
        description: task.description,
        status: newStatus 
      },
      token
    );

    setTasks((prev) =>
      prev.map((task) => (task.id === id ? updatedTask : task))
    );
  } catch (error) {
    console.error("Failed to update task", error.message);
  }
};


  // Delete task
  const deleteTask = async (id) => {

    const backup = tasks;
    setTasks((prev) => prev.filter((task) => task.id !== id));

    try {
      await deleteTaskService(id, token);
      setTasks((prev) => prev.filter((task) => task.id !== id));
    } catch (error) {
      console.error(error.message);
      setTasks(backup);
    }
  };

  // Edit task
  const startEdit = (task) => {
    setEditId(task.id);
    setEditTitle(task.title);
  };

  const saveEdit = async (id) => {

        const oldTask = tasks.find((t) => t.id === id);
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, title: editTitle } : task
      )
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
      setTasks((prev) =>
        prev.map((task) => (task.id === id ? oldTask : task))
      );
    }
  };

  return (
    <div className="mt-6">
      {/* Add Task Form */}
      <form onSubmit={addTask} className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Enter a new task"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className="flex-1 border rounded px-3 py-2"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Add
        </button>
      </form>

      {/* Task List */}
      {tasks.length === 0 ? (
        <p className="text-gray-500">No tasks yet. Add some!</p>
      ) : (
        <ul className="space-y-2">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="flex justify-between items-center p-3 bg-gray-100 rounded"
            >
              {/* Task Title Input */}
              {editId === task.id ? (
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="flex-1 border rounded px-2 py-1 mr-2"
                />
              ) : (
                <span
                  onClick={() => toggleTask(task.id)}
                  className={`cursor-pointer ${
                    task.status === "completed" ? "line-through text-gray-500" : ""
                  }`}
                >
                  {task.title}
                </span>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2">
                {editId === task.id ? (
                  <button
                    onClick={() => saveEdit(task.id)}
                    className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 transition"
                  >
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() => startEdit(task)}
                    className="bg-yellow-400 text-white px-2 py-1 rounded hover:bg-yellow-500 transition"
                  >
                    Edit
                  </button>
                )}

                <button
                  onClick={() => deleteTask(task.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  ❌
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

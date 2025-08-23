import { useState } from "react";
import { CheckCircle, Circle, Trash2, Pencil, Save, History } from "lucide-react";

export default function TaskItem({
  task,
  toggleTask,
  startEdit,
  saveEdit,
  deleteTask,
  editId,
  editTitle,
  setEditTitle,
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <li
      className={`relative flex justify-between items-start p-4 rounded-md shadow-sm transition 
        ${task.status === "completed" ? "bg-green-50" : "bg-white"} 
        hover:shadow-md`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex items-start gap-3">
        <button
          onClick={() => toggleTask(task.id)}
          className="mt-1 text-blue-500 hover:text-blue-700 transition cursor-pointer"
        >
          {task.status === "completed" ? (
            <CheckCircle className="w-6 h-6" />
          ) : (
            <Circle className="w-6 h-6" />
          )}
        </button>

        <div className="flex flex-col">
          {editId === task.id ? (
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="border rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-400"
            />
          ) : (
            <span
              className={`text-md font-medium ${
                task.status === "completed" ? "line-through text-gray-500" : ""
              }`}
            >
              {task.title}
            </span>
          )}

          {task.description && (
            <span className="text-gray-500 text-sm">{task.description}</span>
          )}

          {task.created_at && (
            <span className="flex items-center gap-1 pt-2 text-[11px] italic text-gray-400">
              <History className="w-3 h-3" />
              {new Date(task.created_at).toLocaleString("en-US", {
                dateStyle: "medium",
                timeStyle: "short",
                hour12: true,
              })}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 mt-2 text-blue-500">
        {editId === task.id ? (
          <button
            onClick={() => saveEdit(task.id)}
            className="hover:text-green-600 transition cursor-pointer"
          >
            <Save className="w-5 h-5" />
          </button>
        ) : (
          <>
            <button
              onClick={() => startEdit(task)}
              className="hover:text-blue-700 transition cursor-pointer"
            >
              <Pencil className="w-5 h-5" />
            </button>
            <span className="text-gray-400">|</span>
            <button
              onClick={() => deleteTask(task.id)}
              className="hover:text-red-600 transition cursor-pointer"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </>
        )}
      </div>
    </li>
  );
}

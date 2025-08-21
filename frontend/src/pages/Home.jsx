import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";


export default function Home() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

    const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Welcome, {user?.name} 👋</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>

      <p className="text-gray-700">
        This is your Task Manager dashboard. Here you can view, add, and manage tasks.
      </p>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Your Tasks</h2>
        <p className="text-gray-500">No tasks yet. Add some!</p>
      </div>
    </div>
  );
}

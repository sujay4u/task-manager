import Navbar from "../components/Navbar";
import TaskList from '../components/TaskList';

export default function Home() {

  return (
      <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
        <p className="text-gray-700">
          This is your Task Manager dashboard. Here you can view, add, and manage tasks.
        </p>

        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-2">Your Tasks</h3>
          <TaskList/>
        </div>
      </div>
    </div>
  );
}

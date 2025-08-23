import { Sun, Moon, LogOut } from "lucide-react";

export default function SidebarFooter({ handleLogout }) {
   const now = new Date();
  const hour = now.getHours();
  const isMorning = hour >= 5 && hour < 12;
  const isEvening = hour >= 17 && hour < 21;
  const isNight = hour >= 21 || hour < 5;

  let greeting = "Good Afternoon";
  let Icon = Sun;

  if (isMorning) {
    greeting = "Good Morning";
    Icon = Sun;
  } else if (isEvening) {
    greeting = "Good Evening";
    Icon = Moon;
  } else if (isNight) {
    greeting = "Good Night";
    Icon = Moon;
  }

   const formattedDate = now.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="mt-auto p-4">
      <div className="flex flex-col border-b border-gray-200 pb-4 pl-3 text-gray-600 mb-3">
        <div className="flex items-center gap-2">
          <Icon size={18} className="text-blue-500" />
          <span className="text-md font-medium">{greeting}</span>
        </div>
        <span className="text-xs text-gray-500 ml-6">{formattedDate}</span>
      </div>

      <button
        onClick={handleLogout}
        className="flex items-center justify-center gap-2 w-full px-3 py-1.5 mt-5 text-sm border border-red-500 text-red-500 rounded-md hover:bg-red-50 transition cursor-pointer"
      >
        <LogOut size={16} />
        Logout
      </button>
    </div>
  );
}

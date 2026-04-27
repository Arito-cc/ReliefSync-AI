import { Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function Header() {
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {
    user = null;
  }

  const location = useLocation();

  const [dark, setDark] = useState(
    localStorage.getItem("theme") === "dark"
  );

  /* ================= THEME ================= */
  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  /* ================= PAGE TITLE ================= */
  const getTitle = () => {
    const path = location.pathname;

    if (path.includes("dashboard")) return "Dashboard";
    if (path.includes("tasks")) return "Tasks";
    if (path.includes("volunteers")) return "Volunteers";
    if (path.includes("profile")) return "Profile";

    return "ReliefSync AI";
  };

  const getRoleLabel = () => {
    if (user?.role === "coordinator") return "Coordinator";
    if (user?.role === "volunteer") return "Volunteer";
    return "";
  };

  /* ================= UI ================= */
  return (
    <header className="sticky top-0 z-50 h-[64px] bg-white/90 backdrop-blur border-b flex justify-between items-center px-4">

      {/* LEFT */}
      <div className="flex flex-col">
        <h1 className="font-semibold text-lg text-gray-800">
          {getTitle()}
        </h1>

        <p className="text-xs text-gray-400">
          {getRoleLabel()}
        </p>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-3">

        {/* THEME TOGGLE */}
        <button
          onClick={() => setDark(!dark)}
          className="p-2 rounded-lg hover:bg-gray-100 transition"
        >
          {dark ? (
            <Sun size={18} className="text-yellow-500" />
          ) : (
            <Moon size={18} className="text-gray-600" />
          )}
        </button>

        {/* USER BADGE */}
        <div className="hidden md:flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
          <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-medium">
            {user?.name?.charAt(0).toUpperCase()}
          </div>

          <span className="text-sm text-gray-700">
            {user?.name}
          </span>
        </div>

      </div>
    </header>
  );
}
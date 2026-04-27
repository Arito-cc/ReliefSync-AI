import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardList,
  Users,
  User,
} from "lucide-react";

export default function Sidebar() {
  const location = useLocation();

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {
    user = null;
  }

  if (!user) return null;

  const isActive = (path) =>
    location.pathname.startsWith(path);

  const coordinatorNav = [
    { name: "Dashboard", path: "/coordinator/dashboard", icon: LayoutDashboard },
    { name: "Tasks", path: "/coordinator/tasks", icon: ClipboardList },
    { name: "Volunteers", path: "/coordinator/volunteers", icon: Users },
    { name: "Profile", path: "/coordinator/profile", icon: User },
  ];

  const volunteerNav = [
    { name: "Dashboard", path: "/volunteer/dashboard", icon: LayoutDashboard },
    { name: "Tasks", path: "/volunteer/tasks", icon: ClipboardList },
    { name: "Profile", path: "/volunteer/profile", icon: User },
  ];

  const navItems =
    user.role === "coordinator" ? coordinatorNav : volunteerNav;

  return (
    <aside className="hidden md:flex flex-col fixed top-0 left-0 h-screen w-64 bg-white border-r z-40">

      {/* 🔥 BRAND */}
      <div className="h-[64px] flex items-center px-5 border-b">
        <h2 className="text-xl font-semibold text-blue-600">
          ReliefSync
        </h2>
      </div>

      {/* 🔥 NAV */}
      <div className="flex-1 overflow-y-auto px-3 py-4">
        <p className="text-xs text-gray-400 px-3 mb-3 uppercase tracking-wide">
          Menu
        </p>

        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg mb-1 transition ${
                active
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Icon
                size={18}
                className={active ? "text-blue-600" : "text-gray-400"}
              />

              <span className={`text-sm ${active ? "font-medium" : ""}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>

      {/* 🔥 USER FOOTER */}
      <div className="border-t px-4 py-3 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-medium">
          {user?.name?.charAt(0).toUpperCase()}
        </div>

        <div className="flex flex-col">
          <span className="text-sm text-gray-700">
            {user?.name}
          </span>
          <span className="text-xs text-gray-400 capitalize">
            {user?.role}
          </span>
        </div>
      </div>

    </aside>
  );
}
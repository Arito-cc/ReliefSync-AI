import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardList,
  Users,
  User,
} from "lucide-react";

export default function BottomNav() {
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
    { icon: LayoutDashboard, label: "Home", path: "/coordinator/dashboard" },
    { icon: ClipboardList, label: "Tasks", path: "/coordinator/tasks" },
    { icon: Users, label: "Vols", path: "/coordinator/volunteers" },
    { icon: User, label: "Profile", path: "/coordinator/profile" },
  ];

  const volunteerNav = [
    { icon: LayoutDashboard, label: "Home", path: "/volunteer/dashboard" },
    { icon: ClipboardList, label: "Tasks", path: "/volunteer/tasks" },
    { icon: User, label: "Profile", path: "/volunteer/profile" },
  ];

  const navItems =
    user.role === "coordinator" ? coordinatorNav : volunteerNav;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-md md:hidden z-50">
      <div className="flex justify-around py-2">
        {navItems.map((item, i) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <Link
              key={i}
              to={item.path}
              className="flex flex-col items-center justify-center flex-1"
            >
              {/* 🔥 ACTIVE INDICATOR */}
              <div
                className={`flex flex-col items-center px-2 py-1 rounded-lg transition ${
                  active
                    ? "bg-blue-50"
                    : "hover:bg-gray-100"
                }`}
              >
                <Icon
                  size={20}
                  className={`transition ${
                    active
                      ? "text-blue-600"
                      : "text-gray-400"
                  }`}
                />

                <span
                  className={`text-[11px] mt-1 transition ${
                    active
                      ? "text-blue-600 font-medium"
                      : "text-gray-400"
                  }`}
                >
                  {item.label}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
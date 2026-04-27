import MainLayout from "../../layout/MainLayout";
import { useNavigate } from "react-router-dom";
import { User, LogOut, ShieldCheck } from "lucide-react";
import { useState } from "react";
import API from "../../api/api";

export default function Profile() {
  const navigate = useNavigate();

  let storedUser = null;
  try {
    storedUser = JSON.parse(localStorage.getItem("user"));
  } catch {
    storedUser = null;
  }

  const [user, setUser] = useState(storedUser);
  const [loading, setLoading] = useState(false);

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const toggleAvailability = async () => {
    try {
      if (user.role !== "volunteer") return;

      setLoading(true);

      await API.put(`/users/toggle/${user.id}`);

      const updated = {
        ...user,
        availability: !user.availability,
      };

      setUser(updated);
      localStorage.setItem("user", JSON.stringify(updated));
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <p>Loading...</p>;

  return (
    <MainLayout>
      <div className="max-w-xl mx-auto space-y-6">

        {/* ================= PROFILE CARD ================= */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl p-6 shadow">

          <div className="flex items-center gap-4">

            {/* AVATAR */}
            <div className="w-14 h-14 rounded-full bg-white text-blue-600 flex items-center justify-center text-lg font-bold">
              {user.name?.charAt(0).toUpperCase()}
            </div>

            <div>
              <h2 className="text-lg font-semibold">{user.name}</h2>
              <p className="text-sm opacity-80 capitalize">{user.role}</p>
            </div>

          </div>
        </div>

        {/* ================= DETAILS ================= */}
        <div className="bg-white rounded-2xl shadow-sm border p-5">
          <h3 className="font-semibold mb-4 flex items-center gap-2 text-gray-800">
            <ShieldCheck size={18} />
            Account Details
          </h3>

          <div className="text-sm space-y-3 text-gray-700">

            <div className="flex justify-between">
              <span className="text-gray-400">User ID</span>
              <span className="font-medium">{user.id}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-400">Name</span>
              <span className="font-medium">{user.name}</span>
            </div>

            <div className="flex justify-between capitalize">
              <span className="text-gray-400">Role</span>
              <span className="font-medium">{user.role}</span>
            </div>

          </div>
        </div>

        {/* ================= AVAILABILITY ================= */}
        {user.role === "volunteer" && (
          <div className="bg-white rounded-2xl shadow-sm border p-5">

            <h3 className="font-semibold mb-4 text-gray-800">
              Availability
            </h3>

            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm font-medium">
                  {user.availability ? "Available" : "Unavailable"}
                </p>
                <p className="text-xs text-gray-400">
                  Toggle to receive tasks
                </p>
              </div>

              {/* SWITCH */}
              <button
                disabled={loading}
                onClick={toggleAvailability}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition ${
                  user.availability ? "bg-green-500" : "bg-gray-300"
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition ${
                    user.availability ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>

            </div>

          </div>
        )}

        {/* ================= LOGOUT ================= */}
        <div className="bg-white rounded-2xl shadow-sm border p-5">

          <button
            onClick={logout}
            className="w-full bg-red-500 hover:bg-red-600 transition text-white py-2 rounded-lg flex items-center justify-center gap-2"
          >
            <LogOut size={16} />
            Logout
          </button>

        </div>

      </div>
    </MainLayout>
  );
}
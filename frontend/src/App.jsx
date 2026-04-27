import { Routes, Route, Navigate } from "react-router-dom";

// AUTH
import Login from "./pages/Login";
import Register from "./pages/Register";

// COORDINATOR
import Dashboard from "./pages/coordinator/Dashboard";
import Tasks from "./pages/coordinator/Tasks";
import Volunteers from "./pages/coordinator/Volunteers";
import Profile from "./pages/coordinator/Profile";

// VOLUNTEER
import VolunteerDashboard from "./pages/volunteer/Dashboard";
import VolunteerTasks from "./pages/volunteer/Tasks";
import VolunteerProfile from "./pages/volunteer/Profile";

// PROTECTED ROUTE
import ProtectedRoute from "./routes/ProtectedRoute";

export default function App() {
  return (
    <Routes>

      {/* ================= PUBLIC ================= */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* ================= ROOT REDIRECT ================= */}
      <Route path="/" element={<RootRedirect />} />

      {/* ================= COORDINATOR ================= */}
      <Route
        path="/coordinator"
        element={
          <ProtectedRoute role="coordinator">
            <OutletWrapper />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="tasks" element={<Tasks />} />
        <Route path="volunteers" element={<Volunteers />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      {/* ================= VOLUNTEER ================= */}
      <Route
        path="/volunteer"
        element={
          <ProtectedRoute role="volunteer">
            <OutletWrapper />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<VolunteerDashboard />} />
        <Route path="tasks" element={<VolunteerTasks />} />
        <Route path="profile" element={<VolunteerProfile />} />
      </Route>

      {/* ================= FALLBACK ================= */}
      <Route path="*" element={<Navigate to="/" />} />

    </Routes>
  );
}

/* ================= ROOT REDIRECT ================= */
function RootRedirect() {
  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {
    user = null;
  }

  if (!user) return <Navigate to="/login" />;

  return (
    <Navigate
      to={
        user.role === "coordinator"
          ? "/coordinator/dashboard"
          : "/volunteer/dashboard"
      }
    />
  );
}

/* ================= OUTLET WRAPPER ================= */
import { Outlet } from "react-router-dom";

function OutletWrapper() {
  return <Outlet />;
}
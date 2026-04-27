import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children, role }) {
  const location = useLocation();

  let user = null;

  // 🔥 SAFE PARSE (prevents crash)
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {
    user = null;
  }

  // ❌ NOT LOGGED IN
  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  // ❌ ROLE MISMATCH
  if (role && user.role !== role) {
    return (
      <Navigate
        to={
          user.role === "coordinator"
            ? "/coordinator/dashboard"
            : "/volunteer/dashboard"
        }
        replace
      />
    );
  }

  // ✅ ACCESS GRANTED
  return children;
}
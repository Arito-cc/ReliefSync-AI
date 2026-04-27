import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

import {
  HandHeart,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  /* ================= HANDLERS ================= */
  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const login = async () => {
    if (loading) return;

    try {
      setLoading(true);
      setError("");

      if (!form.email.trim() || !form.password.trim()) {
        setError("All fields are required");
        return;
      }

      const res = await API.post("/auth/login", form);
      const data = res.data.user;

      const user = {
        id: data.id || data._id,
        name: data.name,
        role: data.role,
        availability: data.availability ?? true,
      };

      localStorage.setItem("user", JSON.stringify(user));

      navigate(
        user.role === "coordinator"
          ? "/coordinator/dashboard"
          : "/volunteer/dashboard"
      );
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    login();
  };

  /* ================= UI ================= */
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

        {/* ================= HEADER ================= */}
        <div className="flex flex-col items-center mb-6">
          <div className="bg-blue-100 p-4 rounded-xl mb-3">
            <HandHeart className="text-blue-600 w-6 h-6" />
          </div>

          <h1 className="text-2xl font-bold text-blue-600">
            ReliefSync AI
          </h1>

          <p className="text-gray-500 text-sm mt-1 text-center">
            Coordinate relief. Save time. Save lives.
          </p>
        </div>

        {/* ================= FORM ================= */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* ERROR */}
          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100">
              {error}
            </div>
          )}

          {/* EMAIL */}
          <div>
            <label className="block text-sm mb-1">Email</label>

            <div className="flex items-center border border-gray-300 rounded-lg px-3 bg-white transition
              focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">

              <Mail className="text-gray-400 mr-2 w-4 h-4" />

              <input
                type="email"
                name="email"
                value={form.email}
                placeholder="you@example.com"
                onChange={handleChange}
                className="w-full py-2 bg-transparent text-sm outline-none focus:outline-none focus:ring-0 border-0"
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block text-sm mb-1">Password</label>

            <div className="flex items-center border border-gray-300 rounded-lg px-3 bg-white transition
              focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">

              <Lock className="text-gray-400 mr-2 w-4 h-4" />

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                placeholder="Enter your password"
                onChange={handleChange}
                className="w-full py-2 bg-transparent text-sm outline-none focus:outline-none focus:ring-0 border-0"
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg flex items-center justify-center gap-2 text-white font-medium transition
              ${
                loading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 active:scale-[0.99]"
              }`}
          >
            {loading && <Loader2 className="animate-spin" size={16} />}
            {loading ? "Signing in..." : "Sign In"}
          </button>

        </form>

        {/* ================= FOOTER ================= */}
        <p className="text-center mt-5 text-sm text-gray-500">
          Don't have an account?{" "}
          <span
            className="text-blue-600 cursor-pointer font-medium hover:underline"
            onClick={() => navigate("/register")}
          >
            Register
          </span>
        </p>

      </div>
    </div>
  );
}
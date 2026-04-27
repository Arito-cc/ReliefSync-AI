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
  UserPlus,
  GraduationCap,
} from "lucide-react";

const SKILLS = [
  "medical",
  "food",
  "logistics",
  "rescue",
  "translation",
  "counseling",
];

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "volunteer",
    skills: [],
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

  const toggleSkill = (skill) => {
    setForm((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill],
    }));
  };

  const register = async () => {
    if (loading) return;

    try {
      setLoading(true);
      setError("");

      if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
        setError("Please fill all required fields");
        return;
      }

      if (form.password.length < 6) {
        setError("Password must be at least 6 characters");
        return;
      }

      await API.post("/auth/register", {
        ...form,
        skills: form.role === "volunteer" ? form.skills : [],
      });

      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    register();
  };

  return (
    <div className="min-h-screen overflow-y-auto flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-10">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 space-y-5">

        {/* HEADER */}
        <div className="flex flex-col items-center text-center">
          <div className="bg-blue-100 p-4 rounded-xl mb-3">
            <UserPlus className="text-blue-600 w-6 h-6" />
          </div>

          <h1 className="text-2xl font-bold text-blue-600">
            ReliefSync AI
          </h1>

          <p className="text-gray-500 text-sm">
            Create your account and start helping
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* ERROR */}
          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100">
              {error}
            </div>
          )}

          {/* NAME */}
          <div>
            <label className="text-sm">Full Name</label>

            <input
              name="name"
              value={form.name}
              placeholder="e.g. Rahul Sharma"
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg 
              text-sm bg-white
              outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* EMAIL */}
          <div>
            <label className="text-sm">Email</label>

            <div className="flex items-center border border-gray-300 rounded-lg px-3 mt-1 bg-white
              focus-within:ring-2 focus-within:ring-blue-500">

              <Mail className="text-gray-400 mr-2 w-4 h-4" />

              <input
                name="email"
                value={form.email}
                placeholder="you@example.com"
                onChange={handleChange}
                className="w-full py-2 bg-transparent text-sm 
                outline-none border-0 focus:ring-0"
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div>
            <label className="text-sm">Password</label>

            <div className="flex items-center border border-gray-300 rounded-lg px-3 mt-1 bg-white
              focus-within:ring-2 focus-within:ring-blue-500">

              <Lock className="text-gray-400 mr-2 w-4 h-4" />

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                placeholder="Minimum 6 characters"
                onChange={handleChange}
                className="w-full py-2 bg-transparent text-sm 
                outline-none border-0 focus:ring-0"
              />

              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* ROLE */}
          <div>
            <p className="text-sm mb-2">Select Role</p>

            <div className="grid grid-cols-2 gap-3">

              <button
                type="button"
                onClick={() => setForm((p) => ({ ...p, role: "volunteer" }))}
                className={`p-3 rounded-lg border text-left transition ${
                  form.role === "volunteer"
                    ? "border-blue-500 bg-blue-50"
                    : "hover:bg-gray-50"
                }`}
              >
                <HandHeart className="text-blue-600 mb-1" size={18} />
                <p className="text-sm font-medium">Volunteer</p>
                <p className="text-xs text-gray-400">Help on ground</p>
              </button>

              <button
                type="button"
                onClick={() => setForm((p) => ({ ...p, role: "coordinator" }))}
                className={`p-3 rounded-lg border text-left transition ${
                  form.role === "coordinator"
                    ? "border-blue-500 bg-blue-50"
                    : "hover:bg-gray-50"
                }`}
              >
                <GraduationCap className="text-blue-600 mb-1" size={18} />
                <p className="text-sm font-medium">Coordinator</p>
                <p className="text-xs text-gray-400">Manage operations</p>
              </button>

            </div>
          </div>

          {/* SKILLS (CLEAN VERSION) */}
          {form.role === "volunteer" && (
            <div>
              <p className="text-sm mb-2">Select Skills</p>

              <div className="flex flex-wrap gap-2">
                {SKILLS.map((skill) => {
                  const active = form.skills.includes(skill);

                  return (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleSkill(skill)}
                      className={`px-3 py-1.5 text-xs rounded-full border transition-all
                      ${
                        active
                          ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                          : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <span className="flex items-center gap-2">

                        {/* subtle dot indicator */}
                        <span
                          className={`w-2 h-2 rounded-full ${
                            active ? "bg-white" : "bg-gray-400"
                          }`}
                        />

                        {skill}

                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg flex items-center justify-center gap-2 text-white font-medium transition
              ${
                loading
                  ? "bg-blue-400"
                  : "bg-blue-600 hover:bg-blue-700 active:scale-[0.99]"
              }`}
          >
            {loading && <Loader2 className="animate-spin" size={16} />}
            {loading ? "Creating account..." : "Create Account"}
          </button>

        </form>

        {/* FOOTER */}
        <p className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <span
            className="text-blue-600 cursor-pointer font-medium hover:underline"
            onClick={() => navigate("/login")}
          >
            Sign In
          </span>
        </p>

      </div>
    </div>
  );
}
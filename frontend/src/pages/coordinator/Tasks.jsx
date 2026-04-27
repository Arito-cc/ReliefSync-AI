import { useEffect, useState } from "react";
import MainLayout from "../../layout/MainLayout";
import API from "../../api/api";
import { SKILLS } from "../../constants/skills";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [skill, setSkill] = useState("");
  const [priority, setPriority] = useState("medium");

  const [loading, setLoading] = useState(false);

  /* ================= FETCH ================= */
  const fetchTasks = async () => {
    const res = await API.get("/tasks");
    setTasks(res.data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  /* ================= CREATE ================= */
  const createTask = async () => {
    if (!title || !description) return;

    try {
      setLoading(true);

      await API.post("/tasks", {
        title,
        description,
        requiredSkill: skill,
        priority,
      });

      setTitle("");
      setDescription("");
      setSkill("");
      setPriority("medium");

      fetchTasks();
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= FILTER ================= */
  const activeTasks = tasks.filter((t) => t.status !== "completed");
  const completedTasks = tasks.filter((t) => t.status === "completed");

  /* ================= HELPERS ================= */
  const getPriorityColor = (p) => {
    if (p === "high") return "bg-red-100 text-red-600";
    if (p === "medium") return "bg-yellow-100 text-yellow-600";
    return "bg-gray-100 text-gray-600";
  };

  const getStatusColor = (s) => {
    if (s === "pending") return "bg-gray-100 text-gray-600";
    if (s === "assigned") return "bg-blue-100 text-blue-600";
    if (s === "in-progress") return "bg-yellow-100 text-yellow-600";
    if (s === "completed") return "bg-green-100 text-green-600";
  };

  return (
    <MainLayout>
      <div className="space-y-6">

        {/* ================= CREATE CARD ================= */}
        <div className="bg-white rounded-2xl shadow-sm border p-5">

          <h2 className="font-semibold mb-4">Create New Task</h2>

          <div className="grid md:grid-cols-2 gap-3 mb-3">
            <input
              value={title}
              placeholder="Task Title"
              className="border p-2 rounded-lg"
              onChange={(e) => setTitle(e.target.value)}
            />

            <select
              value={priority}
              className="border p-2 rounded-lg"
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
          </div>

          <textarea
            value={description}
            placeholder="Task Description"
            className="w-full border p-2 rounded-lg mb-3"
            onChange={(e) => setDescription(e.target.value)}
          />

          <select
            value={skill}
            className="border p-2 rounded-lg mb-4 w-full"
            onChange={(e) => setSkill(e.target.value)}
          >
            <option value="">Select Skill</option>
            {SKILLS.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>

          <button
            onClick={createTask}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 transition text-white py-2 rounded-lg"
          >
            {loading ? "Adding..." : "Add Task"}
          </button>

        </div>

        {/* ================= ACTIVE ================= */}
        <div>
          <h2 className="font-semibold mb-4">
            Active Tasks ({activeTasks.length})
          </h2>

          {activeTasks.length === 0 ? (
            <p className="text-gray-400 text-sm">
              No active tasks
            </p>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {activeTasks.map((t) => (
                <div key={t._id} className="bg-white p-4 rounded-xl shadow-sm border">

                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">{t.title}</h3>

                    <span className={`text-xs px-2 py-1 rounded ${getPriorityColor(t.priority)}`}>
                      {t.priority}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mb-3">
                    {t.description}
                  </p>

                  <div className="flex justify-between items-center text-xs">

                    <span className="text-gray-500">
                      Skill: {t.requiredSkill || "general"}
                    </span>

                    <span className={`px-2 py-1 rounded ${getStatusColor(t.status)}`}>
                      {t.status}
                    </span>

                  </div>

                </div>
              ))}
            </div>
          )}
        </div>

        {/* ================= COMPLETED ================= */}
        <div>
          <h2 className="font-semibold mb-4">
            Completed Tasks ({completedTasks.length})
          </h2>

          {completedTasks.length === 0 ? (
            <p className="text-gray-400 text-sm">
              No completed tasks yet
            </p>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {completedTasks.map((t) => (
                <div key={t._id} className="bg-gray-50 p-4 rounded-xl border">

                  <h3 className="font-medium">{t.title}</h3>

                  <p className="text-sm text-gray-500 mt-1">
                    {t.description}
                  </p>

                  <div className="text-xs text-green-600 mt-2">
                    ✔ Completed
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </MainLayout>
  );
}
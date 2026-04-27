import { useEffect, useState } from "react";
import MainLayout from "../../layout/MainLayout";
import API from "../../api/api";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState("");

  /* ================= INIT ================= */
  useEffect(() => {
    let storedUser = null;
    try {
      storedUser = JSON.parse(localStorage.getItem("user"));
    } catch {
      storedUser = null;
    }

    if (!storedUser) return;

    setUser(storedUser);
    fetchTasks(storedUser.id);
  }, []);

  /* ================= FETCH ================= */
  const fetchTasks = async (id) => {
    try {
      setLoading(true);
      const res = await API.get(`/assignments/my/${id}`);
      setTasks(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= ACTION ================= */
  const acceptTask = async (id) => {
    try {
      await API.put(`/assignments/${id}/accept`);
      setActionMsg("🚀 Task accepted successfully");
      fetchTasks(user.id);
    } catch (err) {
      setActionMsg("❌ Failed to accept task");
    }
  };

  /* ================= TIMER ================= */
  const getTimeLeft = (expiresAt) => {
    if (!expiresAt) return null;

    const diff = new Date(expiresAt) - new Date();

    if (diff <= 0) return "Expired";

    const mins = Math.floor(diff / 60000);
    const secs = Math.floor((diff % 60000) / 1000);

    return `${mins}m ${secs}s`;
  };

  if (!user) return <p>Loading...</p>;

  /* ================= FILTER ================= */
  const pending = tasks.filter((t) => t.status === "assigned");
  const completed = tasks.filter((t) => t.status === "completed");

  return (
    <MainLayout>

      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold">Tasks</h1>
        <p className="text-sm text-gray-400">
          Choose wisely. Tasks expire.
        </p>
      </div>

      {/* ACTION FEEDBACK */}
      {actionMsg && (
        <div className="bg-green-50 text-green-700 text-sm p-3 rounded-xl mb-4">
          {actionMsg}
        </div>
      )}

      {/* LOADING */}
      {loading && (
        <p className="text-gray-500 mb-4">Loading tasks...</p>
      )}

      {/* ================= PENDING ================= */}
      <div className="mb-6">

        <h2 className="font-semibold mb-3">
          Available Tasks ({pending.length})
        </h2>

        {pending.length === 0 ? (
          <div className="bg-white p-4 rounded-xl shadow text-sm text-gray-400">
            No new tasks available
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">

            {pending.map((t) => {
              const timeLeft = getTimeLeft(t.expiresAt);

              return (
                <div
                  key={t.assignmentId}
                  className="bg-white p-4 rounded-xl shadow-sm border hover:shadow-md transition"
                >

                  {/* TITLE */}
                  <h3 className="font-medium">
                    {t.task.title}
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    {t.task.description}
                  </p>

                  {/* TAGS */}
                  <div className="flex justify-between mt-3 text-xs">

                    <span
                      className={`px-2 py-1 rounded ${
                        t.task.priority === "high"
                          ? "bg-red-100 text-red-600"
                          : t.task.priority === "medium"
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {t.task.priority}
                    </span>

                    <span className="text-gray-400">
                      {t.task.requiredSkill}
                    </span>

                  </div>

                  {/* TIMER 🔥 */}
                  {timeLeft && (
                    <div className="mt-2 text-xs text-red-500">
                      ⏳ {timeLeft}
                    </div>
                  )}

                  {/* ACTION */}
                  <button
                    onClick={() => acceptTask(t.assignmentId)}
                    className="mt-3 bg-blue-600 hover:bg-blue-700 transition text-white px-4 py-1.5 rounded-lg text-sm w-full"
                  >
                    Accept Task
                  </button>

                </div>
              );
            })}

          </div>
        )}
      </div>

      {/* ================= COMPLETED ================= */}
      <div>

        <h2 className="font-semibold mb-3">
          Completed Tasks ({completed.length})
        </h2>

        {completed.length === 0 ? (
          <div className="bg-white p-4 rounded-xl shadow text-sm text-gray-400">
            No completed tasks yet
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">

            {completed.map((t) => (
              <div
                key={t.assignmentId}
                className="bg-gray-50 p-4 rounded-xl border"
              >
                <h3 className="font-medium">
                  {t.task.title}
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  {t.task.description}
                </p>

                <p className="text-xs text-green-600 mt-2">
                  ✔ Completed
                </p>

              </div>
            ))}

          </div>
        )}

      </div>

    </MainLayout>
  );
}
import { useEffect, useState } from "react";
import MainLayout from "../../layout/MainLayout";
import API from "../../api/api";

export default function Dashboard() {
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

  /* ================= ACTIONS ================= */
  const completeTask = async (id) => {
    await API.put(`/assignments/${id}/complete`);
    setActionMsg("✅ Task completed");
    fetchTasks(user.id);
  };

  const acceptTask = async (id) => {
    await API.put(`/assignments/${id}/accept`);
    setActionMsg("🚀 Task accepted");
    fetchTasks(user.id);
  };

  const toggleAvailability = async () => {
    await API.put(`/users/toggle/${user.id}`);

    const updated = {
      ...user,
      availability: !user.availability,
    };

    setUser(updated);
    localStorage.setItem("user", JSON.stringify(updated));
  };

  if (!user) return <p>Loading...</p>;

  /* ================= FILTER ================= */
  const activeTask = tasks.find((t) => t.status === "in-progress");
  const assignedTasks = tasks.filter((t) => t.status === "assigned");
  const completed = tasks.filter((t) => t.status === "completed");

  return (
    <MainLayout>

      {/* ================= HEADER ================= */}
      <div className="mb-6 flex justify-between items-center">

        <div>
          <h1 className="text-xl font-semibold">Your Work</h1>
          <p className="text-xs text-gray-400">
            Focus on one task at a time
          </p>
        </div>

        {/* AVAILABILITY */}
        <button
          onClick={toggleAvailability}
          className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs ${
            user.availability
              ? "bg-green-100 text-green-600"
              : "bg-gray-200 text-gray-600"
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              user.availability ? "bg-green-500" : "bg-gray-400"
            }`}
          ></span>
          {user.availability ? "Available" : "Unavailable"}
        </button>

      </div>

      {/* 🔥 ACTION FEEDBACK */}
      {actionMsg && (
        <div className="bg-green-50 text-green-700 text-sm p-3 rounded-xl mb-4 animate-fade-in">
          {actionMsg}
        </div>
      )}

      {loading && (
        <p className="text-gray-500 mb-4">Loading...</p>
      )}

      {/* ================= ACTIVE TASK ================= */}
      <div className="mb-6">
        <h2 className="font-semibold mb-3">Current Task</h2>

        {!activeTask ? (
          <div className="bg-gray-50 p-4 rounded-xl text-sm text-gray-400">
            No active task  
            <br />
            Accept one below to start working
          </div>
        ) : (
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl shadow-sm animate-fade-in">

            <h3 className="font-semibold">
              {activeTask.task.title}
            </h3>

            <p className="text-sm text-gray-600 mt-1">
              {activeTask.task.description}
            </p>

            <button
              onClick={() =>
                completeTask(activeTask.assignmentId)
              }
              className="mt-3 bg-green-600 hover:bg-green-700 transition text-white px-4 py-1.5 rounded-lg text-sm"
            >
              Mark Complete
            </button>

          </div>
        )}
      </div>

      {/* ================= AVAILABLE TASKS ================= */}
      <div className="mb-6">

        <div className="flex justify-between items-center mb-3">
          <h2 className="font-semibold">
            Available Tasks ({assignedTasks.length})
          </h2>
        </div>

        {assignedTasks.length === 0 ? (
          <p className="text-gray-400 text-sm">
            No tasks available right now
          </p>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">

            {assignedTasks.map((t) => (
              <div
                key={t.assignmentId}
                className="bg-white p-4 rounded-xl shadow-sm border hover:shadow-md transition"
              >

                <h3 className="font-medium">
                  {t.task.title}
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  {t.task.description}
                </p>

                <button
                  onClick={() =>
                    acceptTask(t.assignmentId)
                  }
                  className="mt-3 bg-blue-600 hover:bg-blue-700 transition text-white px-3 py-1.5 rounded-lg text-sm"
                >
                  Accept Task
                </button>

              </div>
            ))}

          </div>
        )}
      </div>

      {/* ================= COMPLETED ================= */}
      <div>

        <h2 className="font-semibold mb-3">
          Completed Tasks ({completed.length})
        </h2>

        {completed.length === 0 ? (
          <p className="text-gray-400 text-sm">
            No completed tasks yet
          </p>
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
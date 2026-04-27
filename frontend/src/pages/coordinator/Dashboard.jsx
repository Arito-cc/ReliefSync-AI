import { useEffect, useState } from "react";
import MainLayout from "../../layout/MainLayout";
import API from "../../api/api";
import { Users, ListChecks } from "lucide-react";

export default function Dashboard() {
  const [allocation, setAllocation] = useState([]);
  const [unassigned, setUnassigned] = useState([]);
  const [history, setHistory] = useState([]);

  const [stats, setStats] = useState({
    tasks: 0,
    volunteers: 0,
  });

  const [loading, setLoading] = useState(false);
  const [hasRun, setHasRun] = useState(false);

  const [showAllLatest, setShowAllLatest] = useState(false);
  const [showAllHistory, setShowAllHistory] = useState(false);

  /* ================= FETCH ================= */

  const fetchStats = async () => {
    const t = await API.get("/tasks");
    const v = await API.get("/users/volunteers");

    setStats({
      tasks: t.data.filter((t) => t.status !== "completed").length,
      volunteers: v.data.filter((v) => v.availability).length,
    });
  };

  const fetchHistory = async () => {
    const res = await API.get("/allocation/history");
    setHistory(res.data);
  };

  /* ================= RUN ================= */

  const runAllocation = async () => {
    if (loading) return;

    try {
      setLoading(true);

      const res = await API.post("/allocation/run");

      const assigned = res.data.assignments || [];
      const failed = res.data.unassigned || [];

      setAllocation(assigned);
      setUnassigned(failed);
      setHasRun(true);

      localStorage.setItem(
        "lastAllocation",
        JSON.stringify({ assigned, failed })
      );

      fetchStats();
      fetchHistory();
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= INIT ================= */

  useEffect(() => {
    fetchStats();
    fetchHistory();

    const saved = JSON.parse(localStorage.getItem("lastAllocation"));
    if (saved) {
      setAllocation(saved.assigned || []);
      setUnassigned(saved.failed || []);
      setHasRun(true);
    }
  }, []);

  return (
    <MainLayout>

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">

        <div className="bg-white p-5 rounded-2xl shadow-sm border flex justify-between hover:shadow-md transition">
          <div>
            <p className="text-2xl font-bold">{stats.tasks}</p>
            <p className="text-xs text-gray-400">Active Tasks</p>
          </div>
          <ListChecks className="text-blue-500" />
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border flex justify-between hover:shadow-md transition">
          <div>
            <p className="text-2xl font-bold">{stats.volunteers}</p>
            <p className="text-xs text-gray-400">Available Volunteers</p>
          </div>
          <Users className="text-green-500" />
        </div>

        <div className="hidden md:flex bg-white p-5 rounded-2xl shadow-sm border flex-col justify-center hover:shadow-md transition">
          <p className="text-sm text-gray-500">System Status</p>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <p className="text-green-600 font-medium text-sm">
              Operational
            </p>
          </div>
        </div>

      </div>

      {/* ================= RUN ================= */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 rounded-2xl shadow mb-4 flex flex-col md:flex-row items-center justify-between gap-4">

        <div>
          <h2 className="font-semibold text-lg">
            AI Smart Allocation
          </h2>
          <p className="text-xs opacity-80">
            Automatically match tasks with best volunteers
          </p>
        </div>

        <button
          onClick={runAllocation}
          disabled={loading}
          className="bg-white text-blue-600 px-6 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-[1.03] active:scale-[0.97] shadow"
        >
          {loading ? "⚡ Allocating..." : "Run Allocation"}
        </button>

      </div>

      {/* 🔥 RESULT FEEDBACK */}
      {hasRun && (
        <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl mb-6 animate-fade-in">
          <p className="text-sm font-medium">
            ✅ Allocation completed successfully
          </p>
          <p className="text-xs mt-1">
            {allocation.length} assigned • {unassigned.length} pending
          </p>
        </div>
      )}

      {/* ================= GRID ================= */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* ================= LATEST ================= */}
        <div>

          <div className="flex justify-between items-center mb-3">
            <h2 className="font-semibold">Latest Allocation</h2>

            {allocation.length > 3 && (
              <button
                onClick={() => setShowAllLatest(!showAllLatest)}
                className="text-sm text-blue-600"
              >
                {showAllLatest ? "Show Less" : "See All"}
              </button>
            )}
          </div>

          {!hasRun ? (
            <div className="text-center text-gray-400 text-sm py-6">
              ⚡ No allocation yet  
              <br />
              Run the engine to generate smart matches
            </div>
          ) : (
            <div className={showAllLatest ? "max-h-[400px] overflow-y-auto pr-1" : ""}>

              {(showAllLatest ? allocation : allocation.slice(0, 3)).map((a, i) => (
                <div
                  key={i}
                  className="bg-white p-4 rounded-xl shadow-sm border mb-3 hover:shadow-md transition animate-fade-in"
                >
                  <p className="font-medium">{a.task}</p>

                  <p className="text-sm mt-1">
                    Assigned to:{" "}
                    <span className="text-blue-600 font-semibold">
                      {a.volunteer}
                    </span>
                  </p>

                  <div className="flex flex-wrap gap-2 mt-2">
                    {a.offers?.map((v, idx) => (
                      <span
                        key={idx}
                        className={`px-2 py-1 rounded text-xs ${
                          v === a.volunteer
                            ? "bg-green-100 text-green-600"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {v}
                      </span>
                    ))}
                  </div>

                  <div className="flex justify-between mt-2 text-xs text-gray-400">
                    <span>Score: {a.score}</span>
                    <span>{a.priority}</span>
                  </div>

                  {/* 🔥 AI PRESENCE */}
                  <div className="mt-2 text-xs text-indigo-500 font-medium">
                    🤖 AI matched based on skill + availability
                  </div>

                </div>
              ))}

            </div>
          )}
        </div>

        {/* ================= HISTORY ================= */}
        <div>

          <div className="flex justify-between items-center mb-3">
            <h2 className="font-semibold">Recent Activity</h2>

            {history.length > 3 && (
              <button
                onClick={() => setShowAllHistory(!showAllHistory)}
                className="text-sm text-blue-600"
              >
                {showAllHistory ? "Show Less" : "See All"}
              </button>
            )}
          </div>

          <div className={showAllHistory ? "max-h-[400px] overflow-y-auto pr-1" : ""}>

            {(showAllHistory ? history : history.slice(0, 3)).map((h, i) => (
              <div
                key={i}
                className="bg-white p-4 rounded-xl shadow-sm border mb-3 hover:shadow-md transition"
              >
                <p className="text-xs text-gray-400 mb-1">
                  {new Date(h.createdAt).toLocaleString()}
                </p>

                <p className="text-sm">
                  ✔ {h.assigned.length} assigned
                </p>

                {h.unassigned.length > 0 && (
                  <p className="text-sm text-red-500">
                    ✖ {h.unassigned.length} unassigned
                  </p>
                )}

              </div>
            ))}

          </div>
        </div>

      </div>

    </MainLayout>
  );
}
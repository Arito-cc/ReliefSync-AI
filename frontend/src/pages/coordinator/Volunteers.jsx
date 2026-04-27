import { useEffect, useState } from "react";
import MainLayout from "../../layout/MainLayout";
import API from "../../api/api";
import { Users, RefreshCw } from "lucide-react";

export default function Volunteers() {
  const [vols, setVols] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ================= FETCH ================= */
  const fetchVolunteers = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await API.get("/users/volunteers");
      setVols(res.data);
    } catch (err) {
      console.log(err);
      setError("Failed to load volunteers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVolunteers();
  }, []);

  /* ================= LOAD STATUS ================= */
  const getLoadLevel = (count) => {
    if (count === 0)
      return { label: "Free", color: "bg-green-100 text-green-600" };

    if (count === 1)
      return { label: "Medium", color: "bg-yellow-100 text-yellow-600" };

    return { label: "Busy", color: "bg-red-100 text-red-600" };
  };

  return (
    <MainLayout>
      <div className="space-y-6">

        {/* ================= HEADER ================= */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Users className="text-blue-600" />
            <h1 className="font-semibold text-lg">
              Volunteers
            </h1>
          </div>

          <button
            onClick={fetchVolunteers}
            className="flex items-center gap-1 text-sm px-3 py-1.5 rounded-lg border hover:bg-gray-100 transition"
          >
            <RefreshCw size={14} />
            Refresh
          </button>
        </div>

        {/* ================= SUMMARY BAR ================= */}
        <div className="bg-white rounded-xl border p-4 flex justify-between text-sm">

          <span>
            Total: <strong>{vols.length}</strong>
          </span>

          <span className="text-green-600">
            Available:{" "}
            <strong>
              {vols.filter((v) => v.availability).length}
            </strong>
          </span>

          <span className="text-red-500">
            Busy:{" "}
            <strong>
              {vols.filter((v) => (v.activeTasks || 0) > 1).length}
            </strong>
          </span>

        </div>

        {/* ================= STATES ================= */}
        {loading && (
          <p className="text-gray-500 text-sm">
            Loading volunteers...
          </p>
        )}

        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}

        {!loading && !error && vols.length === 0 && (
          <p className="text-gray-400 text-sm">
            No volunteers found
          </p>
        )}

        {/* ================= GRID ================= */}
        <div className="grid md:grid-cols-2 gap-4">

          {vols.map((v) => {
            const load = getLoadLevel(v.activeTasks || 0);

            return (
              <div
                key={v._id}
                className="bg-white p-4 rounded-xl shadow-sm border hover:shadow-md transition"
              >

                {/* HEADER */}
                <div className="flex justify-between items-center mb-2">

                  <div className="flex items-center gap-2">
                    {/* Avatar */}
                    <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-medium">
                      {v.name?.charAt(0).toUpperCase()}
                    </div>

                    <h2 className="font-medium">
                      {v.name}
                    </h2>
                  </div>

                  {/* Availability */}
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      v.availability
                        ? "bg-green-100 text-green-600"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {v.availability ? "Available" : "Unavailable"}
                  </span>

                </div>

                {/* SKILLS */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {v.skills?.length > 0 ? (
                    v.skills.map((s) => (
                      <span
                        key={s}
                        className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded"
                      >
                        {s}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-gray-400">
                      No skills listed
                    </span>
                  )}
                </div>

                {/* FOOTER */}
                <div className="flex justify-between items-center text-sm">

                  <span className="text-gray-500">
                    Tasks:{" "}
                    <strong>{v.activeTasks || 0}</strong>
                  </span>

                  <span
                    className={`text-xs px-2 py-1 rounded ${load.color}`}
                  >
                    {load.label}
                  </span>

                </div>

              </div>
            );
          })}

        </div>

      </div>
    </MainLayout>
  );
}
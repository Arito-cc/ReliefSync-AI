import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import { connectDB } from "./config/db.js";

import userRoutes from "./routes/user.routes.js";
import taskRoutes from "./routes/task.routes.js";
import assignmentRoutes from "./routes/assignment.routes.js";
import allocationRoutes from "./routes/allocation.routes.js";
import authRoutes from "./routes/auth.routes.js";

dotenv.config();

const app = express();

/* ================= MIDDLEWARE ================= */
app.use(cors());
app.use(express.json());

/* ================= ROUTES ================= */
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/allocation", allocationRoutes);
app.use("/api/auth", authRoutes);

/* ================= HEALTH CHECK ================= */
app.get("/", (req, res) => {
  res.send("API Running 🚀");
});

/* ================= GLOBAL ERROR HANDLER ================= */
app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR:", err.stack);

  res.status(500).json({
    message: "Something went wrong",
  });
});

/* ================= START SERVER ================= */
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    console.log("MongoDB Connected ✅");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} 🚀`);
    });

  } catch (error) {
    console.error("DB CONNECTION FAILED ❌", error.message);
    process.exit(1); // 🔥 crash properly (important)
  }
};

startServer();
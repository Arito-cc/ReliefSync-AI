import express from "express";
import {
  allocateTasks,
  getAllocationHistory,
} from "../controllers/allocation.controller.js";

const router = express.Router();

/* ================= ALLOCATION ================= */

// 🔥 run allocation (manual trigger)
router.post("/run", allocateTasks);

// 🔥 get history (supports ?limit=)
router.get("/history", getAllocationHistory);

export default router;
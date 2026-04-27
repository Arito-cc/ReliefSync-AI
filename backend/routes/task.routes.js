import express from "express";
import { createTask, getTasks } from "../controllers/task.controller.js";

const router = express.Router();

/* ================= TASKS ================= */

// create task
router.post("/", createTask);

// get all tasks
router.get("/", getTasks);

export default router;
import express from "express";
import {
  createAssignment,
  getAssignments,
  getMyTasks,
  acceptTask,
  completeTask,
} from "../controllers/assignment.controller.js";

const router = express.Router();

/* ================= COORDINATOR ================= */

// create assignment
router.post("/", createAssignment);

// get all assignments
router.get("/", getAssignments);

/* ================= VOLUNTEER ================= */

// get my tasks
router.get("/my/:volunteerId", getMyTasks);

// accept task
router.put("/:assignmentId/accept", acceptTask);

// complete task
router.put("/:assignmentId/complete", completeTask);

export default router;
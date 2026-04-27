import express from "express";
import {
  createUser,
  getUsers,
  getVolunteers,
  toggleAvailability,
} from "../controllers/user.controller.js";

const router = express.Router();

/* ================= USERS ================= */

// 🔥 specific routes first (IMPORTANT)

// get all volunteers
router.get("/volunteers", getVolunteers);

// toggle availability
router.put("/toggle/:userId", toggleAvailability);

// 🔥 generic routes after

// create user
router.post("/", createUser);

// get all users
router.get("/", getUsers);

export default router;
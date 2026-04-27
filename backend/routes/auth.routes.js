import express from "express";
import { register, login } from "../controllers/auth.controller.js";

const router = express.Router();

/* ================= AUTH ================= */

// register user
router.post("/register", register);

// login user
router.post("/login", login);

export default router;
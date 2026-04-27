import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";

/* ================= REGISTER ================= */
export const register = async (req, res) => {
  try {
    let { name, email, password, role, skills } = req.body;

    // 🔥 basic validation
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        message: "All fields required",
      });
    }

    // 🔥 normalize email (IMPORTANT)
    email = email.toLowerCase().trim();

    // 🔥 basic password rule (MVP safe)
    if (password.length < 4) {
      return res.status(400).json({
        message: "Password must be at least 4 characters",
      });
    }

    // 🔥 check existing
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // 🔥 hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 🔥 sanitize skills
    let safeSkills = [];
    if (role === "volunteer" && Array.isArray(skills)) {
      safeSkills = skills.filter(Boolean);
    }

    const user = await User.create({
      name: name.trim(),
      email,
      password: hashedPassword,
      role,
      skills: safeSkills,
      availability: true, // default
    });

    res.status(201).json({
      message: "User registered",
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        availability: user.availability,
      },
    });

  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({
      message: "Registration failed",
      error: error.message,
    });
  }
};

/* ================= LOGIN ================= */
export const login = async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password required",
      });
    }

    // 🔥 normalize email
    email = email.toLowerCase().trim();

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        availability: user.availability ?? true,
      },
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({
      message: "Login failed",
      error: error.message,
    });
  }
};
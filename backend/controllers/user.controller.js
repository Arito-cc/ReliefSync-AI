import { User } from "../models/user.model.js";
import { Assignment } from "../models/assignment.model.js";

/* ================= CREATE USER ================= */
export const createUser = async (req, res) => {
  try {
    let { name, role, skills, availability } = req.body;

    if (!name || !role) {
      return res.status(400).json({
        message: "Name and role required",
      });
    }

    // 🔥 sanitize
    name = name.trim();

    const safeSkills =
      role === "volunteer" && Array.isArray(skills)
        ? skills.filter(Boolean)
        : [];

    const user = await User.create({
      name,
      role,
      skills: safeSkills,
      availability: availability ?? true,
    });

    res.status(201).json(user);

  } catch (error) {
    console.error("CREATE USER ERROR:", error);
    res.status(500).json({
      message: "Failed to create user",
      error: error.message,
    });
  }
};

/* ================= GET ALL USERS ================= */
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);

  } catch (error) {
    console.error("GET USERS ERROR:", error);
    res.status(500).json({
      message: "Failed to fetch users",
      error: error.message,
    });
  }
};

/* ================= GET VOLUNTEERS ================= */
export const getVolunteers = async (req, res) => {
  try {
    const volunteers = await User.find({ role: "volunteer" })
      .select("-password");

    const now = new Date();

    // 🔥 SINGLE QUERY (fix N+1 problem)
    const assignments = await Assignment.find({
      $or: [
        { status: "in-progress" },
        {
          status: "assigned",
          isActiveOffer: true,
          expiresAt: { $gt: now },
        },
      ],
    });

    // 🔥 build workload map
    const loadMap = {};
    assignments.forEach((a) => {
      const id = a.volunteerId.toString();
      loadMap[id] = (loadMap[id] || 0) + 1;
    });

    // 🔥 attach counts
    const result = volunteers.map((v) => ({
      ...v._doc,
      activeTasks: loadMap[v._id.toString()] || 0,
    }));

    res.json(result);

  } catch (error) {
    console.error("GET VOLUNTEERS ERROR:", error);
    res.status(500).json({
      message: "Failed to fetch volunteers",
      error: error.message,
    });
  }
};

/* ================= TOGGLE AVAILABILITY ================= */
export const toggleAvailability = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.availability = !user.availability;
    await user.save();

    res.json({
      message: "Availability updated",
      availability: user.availability,
    });

  } catch (error) {
    console.error("TOGGLE ERROR:", error);
    res.status(500).json({
      message: "Failed to update availability",
      error: error.message,
    });
  }
};
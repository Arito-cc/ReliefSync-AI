import { Task } from "../models/task.model.js";

/* ================= CREATE TASK ================= */
export const createTask = async (req, res) => {
  try {
    let { title, description, requiredSkill, priority } = req.body;

    // 🔥 basic validation
    if (!title || !description) {
      return res.status(400).json({
        message: "Title and description required",
      });
    }

    // 🔥 sanitize inputs
    title = title.trim();
    description = description.trim();

    // 🔥 safe defaults
    const safePriority = ["low", "medium", "high"].includes(priority)
      ? priority
      : "medium";

    const task = await Task.create({
      title,
      description,
      requiredSkill: requiredSkill || null,
      priority: safePriority,
      status: "pending", // 🔥 CRITICAL (lifecycle start)
    });

    res.status(201).json(task);

  } catch (error) {
    console.error("CREATE TASK ERROR:", error);
    res.status(500).json({
      message: "Failed to create task",
      error: error.message,
    });
  }
};

/* ================= GET ALL TASKS ================= */
export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });

    res.json(tasks);

  } catch (error) {
    console.error("GET TASKS ERROR:", error);
    res.status(500).json({
      message: "Failed to fetch tasks",
      error: error.message,
    });
  }
};
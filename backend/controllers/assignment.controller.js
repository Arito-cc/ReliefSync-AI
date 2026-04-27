import { Assignment } from "../models/assignment.model.js";
import { Task } from "../models/task.model.js";

/* ================= CREATE ASSIGNMENT ================= */
export const createAssignment = async (req, res) => {
  try {
    const { taskId, volunteerId } = req.body;

    if (!taskId || !volunteerId) {
      return res.status(400).json({
        message: "taskId and volunteerId required",
      });
    }

    const existing = await Assignment.findOne({
      taskId,
      volunteerId,
      isActiveOffer: true,
      status: "assigned",
    });

    if (existing) {
      return res.status(400).json({
        message: "Offer already exists",
      });
    }

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    const assignment = await Assignment.create({
      taskId,
      volunteerId,
      status: "assigned",
      expiresAt,
      isActiveOffer: true,
    });

    await Task.findByIdAndUpdate(taskId, {
      status: "assigned",
    });

    res.status(201).json(assignment);
  } catch (error) {
    console.error("CREATE ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

/* ================= GET ALL ================= */
export const getAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find()
      .populate("taskId")
      .populate("volunteerId");

    res.json(assignments);
  } catch (error) {
    console.error("GET ALL ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

/* ================= GET MY TASKS ================= */
export const getMyTasks = async (req, res) => {
  try {
    const { volunteerId } = req.params;
    const now = new Date();

    const assignments = await Assignment.find({
      volunteerId,
    }).populate("taskId");

    const result = assignments
      .filter((a) => {
        // ❌ hide expired offers only
        if (
          a.status === "assigned" &&
          a.isActiveOffer &&
          a.expiresAt < now
        ) {
          return false;
        }

        // ❌ hide cancelled offers (IMPORTANT FIX)
        if (a.status === "cancelled") return false;

        return true;
      })
      .map((a) => {
        let safeStatus = a.status;

        if (a.taskId?.status === "completed") {
          safeStatus = "completed";
        }

        return {
          assignmentId: a._id,
          status: safeStatus,
          expiresAt: a.expiresAt,
          task: {
            title: a.taskId.title,
            description: a.taskId.description,
            priority: a.taskId.priority,
          },
        };
      });

    res.json(result);
  } catch (error) {
    console.error("GET MY TASKS ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

/* ================= ACCEPT TASK ================= */
export const acceptTask = async (req, res) => {
  try {
    const { assignmentId } = req.params;

    const assignment = await Assignment.findById(assignmentId);

    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    const now = new Date();

    if (assignment.expiresAt < now || !assignment.isActiveOffer) {
      return res.status(400).json({ message: "Offer expired" });
    }

    if (assignment.status !== "assigned") {
      return res.status(400).json({
        message: "Task already taken",
      });
    }

    // 🚫 one active task per volunteer
    const active = await Assignment.findOne({
      volunteerId: assignment.volunteerId,
      status: "in-progress",
    });

    if (active) {
      return res.status(400).json({
        message: "You already have an active task",
      });
    }

    // 🔥 race condition
    const alreadyAccepted = await Assignment.findOne({
      taskId: assignment.taskId,
      status: "in-progress",
    });

    if (alreadyAccepted) {
      return res.status(400).json({
        message: "Task already taken by another volunteer",
      });
    }

    // ✅ winner
    assignment.status = "in-progress";
    assignment.isActiveOffer = false;
    await assignment.save();

    // 🔥 FIX: cancel others (NOT completed)
    await Assignment.updateMany(
      {
        taskId: assignment.taskId,
        _id: { $ne: assignment._id },
        status: "assigned",
      },
      {
        $set: {
          status: "cancelled", // ✅ FIXED
          isActiveOffer: false,
        },
      }
    );

    await Task.findByIdAndUpdate(assignment.taskId, {
      status: "in-progress",
    });

    res.json({
      message: "Task accepted",
      assignment,
    });

  } catch (error) {
    console.error("ACCEPT ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

/* ================= COMPLETE TASK ================= */
export const completeTask = async (req, res) => {
  try {
    const { assignmentId } = req.params;

    const assignment = await Assignment.findById(assignmentId);

    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    if (assignment.status !== "in-progress") {
      return res.status(400).json({
        message: "Task must be in-progress",
      });
    }

    assignment.status = "completed";
    await assignment.save();

    await Task.findByIdAndUpdate(assignment.taskId, {
      status: "completed",
    });

    res.json({
      message: "Task completed",
      assignment,
    });

  } catch (error) {
    console.error("COMPLETE ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};
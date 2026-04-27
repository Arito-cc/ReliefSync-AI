import { runAllocation } from "../services/allocation.service.js";
import { AllocationLog } from "../models/allocationLog.model.js";
import { handleExpiredTasks } from "../services/expiry.service.js";

/* ================= RUN ALLOCATION ================= */
export const allocateTasks = async (req, res) => {
  try {
    // 🔥 STEP 1: CLEAN EXPIRED (lifecycle responsibility)
    await handleExpiredTasks();

    // 🔥 STEP 2: RUN ALLOCATION (only pending tasks)
    const result = await runAllocation();

    const assigned = result.assigned || [];
    const unassigned = result.unassigned || [];

    // 🔥 STEP 3: SAVE HISTORY (only if something happened)
    if (assigned.length > 0 || unassigned.length > 0) {
      await AllocationLog.create({
        assigned,
        unassigned,
      });
    }

    // 🔥 STEP 4: RESPONSE
    res.json({
      message: "Allocation completed",
      assignments: assigned,
      unassigned,
    });

  } catch (error) {
    console.error("ALLOCATION CONTROLLER ERROR:", error);

    res.status(500).json({
      message: "Allocation failed",
      error: error.message,
    });
  }
};

/* ================= GET HISTORY ================= */
export const getAllocationHistory = async (req, res) => {
  try {
    let { limit = 5 } = req.query;

    // 🔥 sanitize input
    limit = Math.min(Number(limit) || 5, 50);

    const logs = await AllocationLog.find()
      .sort({ createdAt: -1 })
      .limit(limit);

    res.json(logs);

  } catch (error) {
    console.error("HISTORY ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch history",
      error: error.message,
    });
  }
};
import { Assignment } from "../models/assignment.model.js";
import { Task } from "../models/task.model.js";

/* ================= HANDLE EXPIRED OFFERS ================= */
export const handleExpiredTasks = async () => {
  try {
    const now = new Date();

    // 🔥 STEP 1: find expired active offers
    const expiredAssignments = await Assignment.find({
      status: "assigned",
      isActiveOffer: true,
      expiresAt: { $lt: now },
    });

    if (expiredAssignments.length === 0) {
      console.log("Expired cleaned: 0");
      return;
    }

    // 🔥 STEP 2: collect task IDs
    const taskIds = [
      ...new Set(expiredAssignments.map((a) => a.taskId.toString())),
    ];

    // 🔥 STEP 3: deactivate expired offers (FAST)
    await Assignment.updateMany(
      {
        status: "assigned",
        isActiveOffer: true,
        expiresAt: { $lt: now },
      },
      {
        $set: {
          status: "completed",
          isActiveOffer: false,
        },
      }
    );

    // 🔥 STEP 4: check if tasks still have ANY active work
    const stillActiveAssignments = await Assignment.find({
      taskId: { $in: taskIds },
      status: { $in: ["assigned", "in-progress"] },
    });

    const activeTaskIds = new Set(
      stillActiveAssignments.map((a) => a.taskId.toString())
    );

    // 🔥 STEP 5: reset tasks with NO active assignments
    const tasksToReset = taskIds.filter(
      (id) => !activeTaskIds.has(id)
    );

    if (tasksToReset.length > 0) {
      await Task.updateMany(
        { _id: { $in: tasksToReset } },
        { $set: { status: "pending" } }
      );
    }

    console.log(`Expired cleaned: ${expiredAssignments.length}`);

  } catch (error) {
    console.error("Expiry Error:", error.message);
  }
};
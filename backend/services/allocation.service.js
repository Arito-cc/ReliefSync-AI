import { Task } from "../models/task.model.js";
import { User } from "../models/user.model.js";
import { Assignment } from "../models/assignment.model.js";
import { getBestVolunteerAI } from "./ai.service.js";

const MAX_ACTIVE_TASKS = 1;

/* ================= PRIORITY SCORE ================= */
const getPriorityScore = (priority) => {
  switch (priority) {
    case "high":
      return 50;
    case "medium":
      return 30;
    default:
      return 10;
  }
};

/* ================= MAIN ================= */
export const runAllocation = async () => {
  // 🔥 ONLY pending tasks
  const tasks = await Task.find({ status: "pending" });

  if (tasks.length === 0) {
    return { assigned: [], unassigned: [] };
  }

  // 🔥 ONLY AVAILABLE volunteers
  const volunteers = await User.find({
    role: "volunteer",
    availability: true,
  });

  if (!volunteers.length) {
    return {
      assigned: [],
      unassigned: tasks.map((t) => ({
        task: t.title,
        reason: "No available volunteers",
      })),
    };
  }

  /* ================= WORKLOAD ================= */
  const workloadMap = {};

  const activeAssignments = await Assignment.find({
    status: "in-progress",
  });

  activeAssignments.forEach((a) => {
    const id = a.volunteerId.toString();
    workloadMap[id] = (workloadMap[id] || 0) + 1;
  });

  /* ================= SORT TASKS ================= */
  tasks.sort((a, b) => {
    const order = { high: 3, medium: 2, low: 1 };
    return order[b.priority] - order[a.priority];
  });

  const assigned = [];
  const unassigned = [];

  /* ================= ALLOCATION ================= */
  for (const task of tasks) {
    /* ========= STEP 0: SKIP IF ALREADY ASSIGNED ========= */
    const existing = await Assignment.findOne({
      taskId: task._id,
      status: { $in: ["assigned", "in-progress"] },
      isActiveOffer: true,
    });

    if (existing) continue;

    /* ========= STEP 1: SCORE ========= */
    const scored = [];

    for (const volunteer of volunteers) {
      const volunteerId = volunteer._id.toString();
      const currentLoad = workloadMap[volunteerId] || 0;

      let score = 0;

      // 🚫 skip overloaded
      if (currentLoad >= MAX_ACTIVE_TASKS) continue;

      // 🔥 SKILL MATCH (SAFE)
      const hasSkill =
        volunteer.skills?.map((s) => s.toLowerCase()).includes(
          task.requiredSkill?.toLowerCase()
        );

      if (hasSkill) score += 50;
      else score -= 10;

      score += 30;
      score += getPriorityScore(task.priority);
      score -= currentLoad * 20;

      scored.push({
        ...volunteer._doc,
        score,
      });
    }

    /* ========= STEP 2: TOP 3 ========= */
    const topCandidates = scored
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    if (topCandidates.length === 0) {
      unassigned.push({
        task: task.title,
        reason: "No eligible volunteers",
      });
      continue;
    }

    /* ========= STEP 3: AI ========= */
    let aiChoice = null;

    try {
      aiChoice = await getBestVolunteerAI(task, topCandidates);
    } catch {
      // ignore
    }

    const bestVolunteer =
      topCandidates.find((v) => v.name === aiChoice?.name) ||
      topCandidates[0];

    /* ========= STEP 4: CREATE MULTI-OFFERS ========= */
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    const bulkOps = topCandidates.map((candidate) => ({
      insertOne: {
        document: {
          taskId: task._id,
          volunteerId: candidate._id,
          status: "assigned",
          expiresAt,
          isActiveOffer: true,
        },
      },
    }));

    try {
      await Assignment.bulkWrite(bulkOps, { ordered: false });
    } catch (err) {
      if (err.code !== 11000) throw err;
    }

    /* ========= STEP 5: UPDATE TASK ========= */
    task.status = "assigned";
    await task.save();

    /* ========= STEP 6: RESPONSE ========= */
    assigned.push({
      task: task.title,
      volunteer: bestVolunteer.name,
      score: Math.round(bestVolunteer.score),
      priority: task.priority,
      reason: aiChoice?.reason || "Rule-based",
      offers: topCandidates.map((v) => v.name),
    });
  }

  return { assigned, unassigned };
};
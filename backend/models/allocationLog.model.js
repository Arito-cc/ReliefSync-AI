import mongoose from "mongoose";

const allocationLogSchema = new mongoose.Schema(
  {
    assigned: [
      {
        task: { type: String, required: true },
        volunteer: { type: String, required: true },
        score: { type: Number, default: 0 },
        priority: { type: String, default: "medium" },

        // 🔥 AI explanation (IMPORTANT for UI)
        reason: { type: String, default: "Rule-based fallback" },

        // 🔥 who all got offers (multi-offer visibility)
        offers: [{ type: String }],
      },
    ],

    unassigned: [
      {
        task: { type: String, required: true },
        reason: { type: String, required: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);

/* ================= INDEX ================= */
// 🔥 fast sorting for dashboard history
allocationLogSchema.index({ createdAt: -1 });

export const AllocationLog = mongoose.model(
  "AllocationLog",
  allocationLogSchema
);
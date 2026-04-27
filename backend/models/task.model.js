import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true, // 🔥 clean input
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["pending", "assigned", "in-progress", "completed"],
      default: "pending",
      index: true, // 🔥 used in allocation
    },

    requiredSkill: {
      type: String,
      default: "general",
      lowercase: true, // 🔥 normalize
      trim: true,
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
      index: true, // 🔥 sorting + allocation
    },
  },
  { timestamps: true }
);

/* ================= INDEXES ================= */

// 🔥 main allocation query
taskSchema.index({ status: 1, priority: -1 });

// 🔥 sorting by latest
taskSchema.index({ createdAt: -1 });

export const Task = mongoose.model("Task", taskSchema);
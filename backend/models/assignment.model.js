import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema(
  {
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true,
      index: true,
    },

    volunteerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: [
        "assigned",     // offer given
        "in-progress",  // accepted
        "completed",    // finished
        "cancelled",    // ❗ NEW (lost race / expired / rejected)
      ],
      default: "assigned",
      index: true,
    },

    expiresAt: {
      type: Date,
      required: true,
    },

    isActiveOffer: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true }
);

/* ================= INDEXES ================= */

// workload queries
assignmentSchema.index({ volunteerId: 1, status: 1 });

// active offers per task
assignmentSchema.index({ taskId: 1, isActiveOffer: 1 });

// prevent duplicate offers
assignmentSchema.index(
  { taskId: 1, volunteerId: 1 },
  { unique: true }
);

// expiry queries
assignmentSchema.index({ expiresAt: 1 });

export const Assignment = mongoose.model("Assignment", assignmentSchema);
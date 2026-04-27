import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true, // 🔥 clean input
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true, // 🔥 normalize
      trim: true,
      index: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["coordinator", "volunteer"],
      required: true,
      index: true, // 🔥 used in queries
    },

    skills: {
      type: [String],
      default: [],
      lowercase: true, // 🔥 normalize skills
    },

    availability: {
      type: Boolean,
      default: true,
      index: true, // 🔥 used in allocation
    },
  },
  {
    timestamps: true,
  }
);

/* ================= INDEXES ================= */

// 🔥 common filter: volunteers + availability
userSchema.index({ role: 1, availability: 1 });

export const User = mongoose.model("User", userSchema);
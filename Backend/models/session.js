import mongoose from "mongoose";

// Defines schema for storing user training sessions with title and exercises
const sessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    exercises: {
      type: [String],
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Session", sessionSchema);

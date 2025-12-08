import mongoose from "mongoose";

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

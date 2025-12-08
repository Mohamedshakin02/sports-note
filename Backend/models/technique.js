import mongoose from "mongoose";

const techniqueSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    sport: {
      type: String,
      required: true,
    },

    steps: {
      type: [String],
      required: true,
    }
  },
  { timestamps: true }
);

export default mongoose.model("Technique", techniqueSchema);

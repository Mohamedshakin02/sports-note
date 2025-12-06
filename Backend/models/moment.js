import mongoose from "mongoose";

const momentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  sport: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, default: "" },
  date: { type: Date },
}, { timestamps: true });

export default mongoose.model("Moment", momentSchema);
import mongoose from "mongoose";

const fixtureSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, 
  team1: { type: String, required: true, trim: true },
  team2: { type: String, required: true, trim: true },
  sport: { type: String, required: true, trim: true },
  date: { type: Date, required: true },
  time: { type: String, default: "" } 
}, { timestamps: true });

export default mongoose.model("Fixture", fixtureSchema);

import mongoose from "mongoose";

const quoteSchema = new mongoose.Schema(
{
userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
quote: { type: String, required: true },
author: { type: String, required: true },
imageUrl: { type: String, default: "" },
},
{ timestamps: true }
);

export default mongoose.model("Quote", quoteSchema);

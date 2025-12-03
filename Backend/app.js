import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

import authRoutes from "./routes/auth.js";

dotenv.config();
const app = express();

// middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use("/api/auth", authRoutes);

// connect MongoDB
mongoose
    .connect(process.env.MONGO_URI, { dbName: "SportsNoteDB" })
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log("DB Error:", err));

app.listen(5000, () => console.log("Server running on port 5000"));

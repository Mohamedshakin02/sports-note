import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import momentsRoutes from "./routes/moments.js";
import fixturesRoutes from "./routes/fixtures.js";

dotenv.config();
const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/moments", momentsRoutes);
app.use("/api/fixtures", fixturesRoutes);


mongoose.connect(process.env.MONGO_URI, { dbName: "SportsNoteDB" })
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

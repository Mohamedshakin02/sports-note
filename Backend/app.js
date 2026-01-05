// Imports required libraries, middleware, and route files
import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import momentsRoutes from "./routes/moments.js";
import fixturesRoutes from "./routes/fixtures.js";
import quotesRoutes from "./routes/quotes.js";
import techniquesRoutes from "./routes/techniques.js";
import sessionRoutes from "./routes/sessions.js";
import adminRoutes from "./routes/admin.js";
import youtubeRoutes from "./routes/youtube.js";

// Imports required libraries, middleware, and route files
dotenv.config();

// Creates and configures the Express application
const app = express();

// Enables CORS for allowed frontend domains
app.use(cors({
  origin: ["http://localhost:5173", "https://sportsnote.vercel.app"],
  credentials: true,
}));

// Enables JSON body parsing and cookie handling
app.use(express.json());
app.use(cookieParser());

// Adds all API routes
app.use("/api/auth", authRoutes);
app.use("/api/moments", momentsRoutes);
app.use("/api/fixtures", fixturesRoutes);
app.use("/api/quotes", quotesRoutes);
app.use("/api/techniques", techniquesRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/youtube", youtubeRoutes);

// code for checking if server is running
app.get("/", (req, res) => {
  res.send("Sports Note Backend is running!");
});

// Test route to check cookies
app.get("/api/test-cookie", (req, res) => {
  console.log(req.cookies); // check if token exists
  res.json({ cookies: req.cookies });
});

// Handles server errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

// Connects to MongoDB database
mongoose.connect(process.env.MONGO_URI, { dbName: "SportsNoteDB" })
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Starts the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

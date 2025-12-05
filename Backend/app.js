import express from "express";
import mongoose from "mongoose";
import session from "express-session";
import cookieParser from "cookie-parser";
import passport from "./config/passport.js";
import authRoutes from "./routes/auth.js";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();

// Middlewares
app.use(cors({
  origin: "http://localhost:5173",  
  credentials: true                
}));
app.use(express.json());
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 day
}));

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api/auth", authRoutes);

// DB
mongoose.connect(process.env.MONGO_URI, { dbName: "SportsNoteDB" })
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

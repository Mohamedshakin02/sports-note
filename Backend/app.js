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

dotenv.config();
const app = express();

// app.js (replace existing app.use(cors({ ... })))
const allowedOrigins = [
  "http://localhost:5173",
  "https://sportsnote.vercel.app",
];

app.use(cors({
  origin: function(origin, callback){
    // allow requests with no origin (like mobile, curl) or if origin is whitelisted
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    } else {
      return callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET","POST","PUT","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization","Accept","X-Requested-With"],
  optionsSuccessStatus: 200
}));


app.options("*", (req, res) => res.sendStatus(200));

app.use(express.json());
app.use(cookieParser());


app.use("/api/auth", authRoutes);
app.use("/api/moments", momentsRoutes);
app.use("/api/fixtures", fixturesRoutes);
app.use("/api/quotes", quotesRoutes);
app.use("/api/techniques", techniquesRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/youtube", youtubeRoutes);

app.get("/", (req, res) => {
  res.send("Sports Note Backend is running!");
});


mongoose.connect(process.env.MONGO_URI, { dbName: "SportsNoteDB" })
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

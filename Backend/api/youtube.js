import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

const app = express();
const PORT = 5000;

dotenv.config();

// Allow frontend to access this backend
app.use(cors());
app.use(express.json());

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY; 


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

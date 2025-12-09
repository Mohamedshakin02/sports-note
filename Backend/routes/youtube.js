import express from "express";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

router.get("/", async (req, res) => {
  const query = req.query.q;
  if (!query) return res.status(400).json({ message: "Query is required" });

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
        query
      )}&maxResults=3&type=video&key=${YOUTUBE_API_KEY}`
    );

    const data = await response.json();
    res.json(data.items);
  } catch (err) {
    console.error("YouTube API error:", err.message);
    res.status(500).json({ message: "Failed to fetch videos" });
  }
});

export default router;

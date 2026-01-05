import express from "express"; // Imports Express
import dotenv from "dotenv";   // Imports dotenv to load environment variables

// Loads environment variables from the .env file
dotenv.config();

// Creates Express router
const router = express.Router();

// Gets YouTube API key from environment
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

// Handles video search request
router.get("/", async (req, res) => {
  const query = req.query.q; // Gets search query from request
  if (!query) return res.status(400).json({ message: "Query is required" });

  try {
    // Calls YouTube API to search for videos
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

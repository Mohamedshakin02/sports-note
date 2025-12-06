import Moment from "../models/moment.js";

// Get moments for a user (only logged-in users)
export const getMoments = async (req, res) => {
  try {
    const userId = req.user?._id; // optional user
    if (!userId) {
      // Guest → return empty array or static default moments
      return res.json([]); // optional: you can send your defaultMoments if you want
    }

    const moments = await Moment.find({ userId }).sort({ date: -1 });
    res.json(moments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add moment (logged-in users only)
export const addMoment = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized. Please log in to add a moment." });
    }

    const { title, sport, description, date, imageUrl } = req.body;

    const newMoment = await Moment.create({
      userId,
      title,
      sport,
      description,
      date,
      imageUrl: imageUrl || ""
    });

    res.status(201).json(newMoment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

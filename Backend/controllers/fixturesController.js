import Fixture from "../models/fixture.js";

// Get fixtures (optionally for logged-in users)
export const getFixtures = async (req, res) => {
  try {
    const userId = req.user?._id; // optional user
    if (!userId) {
      // Guest returns empty array or static default fixtures
      return res.json([]); // optional: you can send your defaultFixtures if you want
    }
    
    const today = new Date();

    // Upcoming fixtures (today and future)
    const upcoming = await Fixture.find({
      userId,
      date: { $gte: today }
    }).sort({ date: 1 }); // nearest first

    // Past fixtures (older than today)
    const past = await Fixture.find({
      userId,
      date: { $lt: today }
    }).sort({ date: -1 }); // recent past first

    // Combine both
    const fixtures = [...upcoming, ...past];

    res.json(fixtures);
    
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add a fixture (logged-in users only)
export const addFixture = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized. Please log in to add a fixture." });

    const { team1, team2, sport, date, time } = req.body;
    const newFixture = await Fixture.create({ userId, team1, team2, sport, date, time });
    res.status(201).json(newFixture);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update fixture (logged-in users only)
export const updateFixture = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { team1, team2, sport, date, time } = req.body;
    const updatedFixture = await Fixture.findOneAndUpdate(
      { _id: req.params.id, userId },
      { team1, team2, sport, date, time },
      { new: true }
    );
    if (!updatedFixture) return res.status(404).json({ message: "Fixture not found" });
    res.json(updatedFixture);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete fixture (logged-in users only)
export const deleteFixture = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const deleted = await Fixture.findOneAndDelete({ _id: req.params.id, userId });
    if (!deleted) return res.status(404).json({ message: "Fixture not found" });
    res.json({ message: "Fixture deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

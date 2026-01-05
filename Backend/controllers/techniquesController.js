import Technique from "../models/technique.js"; // Imports Technique model

// Fetches all techniques for the logged-in user
export const getTechniques = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.json([]);

    const techniques = await Technique.find({ userId }).sort({ createdAt: -1 });

    res.json(techniques);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Adds a new technique for the logged-in user
export const addTechnique = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { title, sport, steps } = req.body;

    const newTechnique = await Technique.create({
      userId,
      title,
      sport,
      steps,
    });

    res.status(201).json(newTechnique);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Updates an existing technique for the logged-in user
export const updateTechnique = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { title, sport, steps } = req.body;

    const updatedTechnique = await Technique.findOneAndUpdate(
      { _id: req.params.id, userId },
      { title, sport, steps },
      { new: true }
    );

    if (!updatedTechnique)
      return res.status(404).json({ message: "Technique not found" });

    res.json(updatedTechnique);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Deletes a technique for the logged-in user
export const deleteTechnique = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const deleted = await Technique.findOneAndDelete({
      _id: req.params.id,
      userId,
    });

    if (!deleted)
      return res.status(404).json({ message: "Technique not found" });

    res.json({ message: "Technique deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

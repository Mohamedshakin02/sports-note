import Technique from "../models/technique.js";

// Get all techniques of logged-in user
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

// Add technique
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

// Update technique
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

// Delete technique
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

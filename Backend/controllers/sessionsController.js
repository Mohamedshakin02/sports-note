import Session from "../models/session.js";

export const getSessions = async (req, res) => {
  try {
    if (!req.user) return res.json([]);  

    const sessions = await Session.find({ userId: req.user._id }).sort({ createdAt: -1 });

    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching sessions" });
  }
};

export const addSession = async (req, res) => {
  const { title, exercises } = req.body;

  try {
    const newSession = await Session.create({
      userId: req.user._id,
      title,
      exercises,
    });

    res.status(201).json(newSession);
  } catch (error) {
    res.status(500).json({ message: "Error adding session" });
  }
};

export const updateSession = async (req, res) => {
  const { id } = req.params;
  const { title, exercises } = req.body;

  try {
    const updated = await Session.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      { title, exercises },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Session not found" });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Error updating session" });
  }
};

export const deleteSession = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await Session.findOneAndDelete({
      _id: id,
      userId: req.user._id,
    });

    if (!deleted) return res.status(404).json({ message: "Session not found" });

    res.json({ message: "Session deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting session" });
  }
};

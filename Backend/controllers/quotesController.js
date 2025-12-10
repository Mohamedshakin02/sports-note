import Quote from "../models/quote.js";

// Get quotes (optional: if user logged in, return user quotes)
export const getQuotes = async (req, res) => {
    try {
        const userId = req.user?._id; // optional user
        if (!userId) {
            return res.json([]); // guest sets default quotes
        }
        const quotes = await Quote.find({ userId }).sort({ createdAt: -1 });
        res.json(quotes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Add quote (logged-in users only)
export const addQuote = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ message: "Unauthorized" });


        const { quote, author, imageUrl } = req.body;

        const newQuote = await Quote.create({
            userId,
            quote,
            author,
            imageUrl: imageUrl || "",
        });

        res.status(201).json(newQuote);


    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update quote
export const updateQuote = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ message: "Unauthorized" });


        const { quote, author, imageUrl } = req.body;
        const updatedQuote = await Quote.findOneAndUpdate(
            { _id: req.params.id, userId },
            { quote, author, imageUrl },
            { new: true }
        );

        if (!updatedQuote) return res.status(404).json({ message: "Quote not found" });
        res.json(updatedQuote);


    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Delete quote
export const deleteQuote = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ message: "Unauthorized" });


        const deleted = await Quote.findOneAndDelete({ _id: req.params.id, userId });
        if (!deleted) return res.status(404).json({ message: "Quote not found" });

        res.json({ message: "Quote deleted successfully" });


    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

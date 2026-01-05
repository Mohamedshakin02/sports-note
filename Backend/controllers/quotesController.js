import Quote from "../models/quote.js";  // Imports Quote model

// Fetches all quotes for the logged-in user
export const getQuotes = async (req, res) => {
    try {
        const userId = req.user?._id; 
        if (!userId) {
            return res.json([]); 
        }
        const quotes = await Quote.find({ userId }).sort({ createdAt: -1 });
        res.json(quotes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Adds a new quote for logged-in users
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

// Updates an existing quote for logged-in users
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

// Deletes a quote for logged-in users
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

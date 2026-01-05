import express from "express"; // Imports Express
import { getQuotes, addQuote, updateQuote, deleteQuote } from "../controllers/quotesController.js"; // Imports quote controllers
import { verifyToken, verifyTokenOptional } from "../middleware/authMiddleware.js"; // Imports auth middleware

const router = express.Router(); // Creates Express router

// Routes for quotes
router.get("/", verifyTokenOptional, getQuotes);  // Gets all quotes, guest sees empty or default
router.post("/", verifyToken, addQuote);          // Adds a new quote, logged-in only
router.put("/:id", verifyToken, updateQuote);     // Updates a quote by ID, logged-in only
router.delete("/:id", verifyToken, deleteQuote);  // Deletes a quote by ID, logged-in only

export default router;

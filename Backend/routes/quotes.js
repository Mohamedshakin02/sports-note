import express from "express";
import { getQuotes, addQuote, updateQuote, deleteQuote } from "../controllers/quotesController.js";
import { verifyToken, verifyTokenOptional } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", verifyTokenOptional, getQuotes);  // guest can see empty or default quotes
router.post("/", verifyToken, addQuote);
router.put("/:id", verifyToken, updateQuote);
router.delete("/:id", verifyToken, deleteQuote);

export default router;

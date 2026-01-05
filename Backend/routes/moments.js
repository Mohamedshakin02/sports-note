import express from "express"; // Imports Express
import { getMoments, addMoment, updateMoment, deleteMoment } from "../controllers/momentsController.js"; // Imports moment controllers
import { verifyToken, verifyTokenOptional } from "../middleware/authMiddleware.js"; // Imports auth middleware

const router = express.Router(); // Creates Express router

// Routes for moments
router.get("/", verifyTokenOptional, getMoments);  // Gets all moments, guest or logged-in
router.post("/", verifyToken, addMoment);          // Adds a new moment, logged-in only
router.put("/:id", verifyToken, updateMoment);     // Updates a moment by ID, logged-in only
router.delete("/:id", verifyToken, deleteMoment);  // Deletes a moment by ID, logged-in only

export default router;
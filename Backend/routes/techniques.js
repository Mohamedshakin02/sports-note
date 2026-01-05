import express from "express"; // Imports Express
import {
  getTechniques,
  addTechnique,
  updateTechnique,
  deleteTechnique,
} from "../controllers/techniquesController.js"; // Imports technique controllers

import { verifyToken, verifyTokenOptional } from "../middleware/authMiddleware.js"; // Imports auth middleware

const router = express.Router(); // Creates Express router

// Routes for techniques
router.get("/", verifyTokenOptional, getTechniques);  // Gets all techniques, guest sees empty or default
router.get("/", verifyToken, getTechniques);          // Gets all techniques, logged-in only
router.post("/", verifyToken, addTechnique);          // Adds a new technique, logged-in only
router.put("/:id", verifyToken, updateTechnique);     // Updates a technique by ID, logged-in only
router.delete("/:id", verifyToken, deleteTechnique);  // Deletes a technique by ID, logged-in only

export default router;

